import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import type { Placement } from "@floating-ui/dom";
import { createEffect, createSignal, createUniqueId, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { claimEscape, getFocusableElements, isInsideNewerLayer, takeEscape } from "./core/createFocusTrap";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface PopoverProps extends CommonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: Placement;
  children: JSX.Element;
  content: JSX.Element;
}

export function Popover(props: PopoverProps & JSX.HTMLAttributes<HTMLSpanElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "open",
    "onOpenChange",
    "placement",
    "content",
    "children",
  ]);

  const panelId = `so-popover-${createUniqueId()}`;

  let triggerRef: HTMLButtonElement | undefined;
  const [panelRef, setPanelRef] = createSignal<HTMLDivElement | undefined>(undefined);

  function updatePosition() {
    const panel = panelRef();
    if (!triggerRef || !panel) return;

    computePosition(triggerRef, panel, {
      placement: local.placement ?? "bottom-start",
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      // Until this runs the panel sits at the document origin, hidden by the
      // CSS; focusing it there would scroll the page to the bottom.
      const firstPlacement = panel.dataset.soPlaced === undefined;
      panel.dataset.soPlaced = "";
      if (firstPlacement) focusPanel(panel);
    });
  }

  // Keep the panel anchored for as long as it is open. A one-shot
  // computePosition would drift on scroll, resize or layout changes.
  createEffect(() => {
    const panel = panelRef();
    if (!local.open || !triggerRef || !panel) return;
    onCleanup(autoUpdate(triggerRef, panel, updatePosition));
  });

  // The panel lives at the end of the document, outside the Tab order, so
  // focus is moved in by hand: the first control, else the panel itself.
  function focusPanel(panel: HTMLElement): void {
    (getFocusableElements(panel)[0] ?? panel).focus();
  }

  function close(): void {
    local.onOpenChange(false);
    triggerRef?.focus();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      if (takeEscape(panelId, e)) close();
      return;
    }
    if (e.key !== "Tab") return;

    const panel = panelRef();
    const active = document.activeElement;
    if (!panel || !(active instanceof HTMLElement)) return;

    if (active === triggerRef && !e.shiftKey) {
      e.preventDefault();
      focusPanel(panel);
      return;
    }
    if (!panel.contains(active)) return;

    const items = getFocusableElements(panel);
    const atEdge = e.shiftKey ? active === items[0] : active === items[items.length - 1];
    if (!atEdge && items.length > 0) return;
    // Leaving the panel: close it and carry on from the trigger. Backwards
    // that means landing on the trigger itself; forwards the browser moves on
    // from the trigger once it has focus.
    if (e.shiftKey) e.preventDefault();
    close();
  }

  function handleClickOutside(e: MouseEvent) {
    const panel = panelRef();
    const target = e.target as Node;
    if (triggerRef?.contains(target)) return;
    if (panel?.contains(target)) return;
    if (isInsideNewerLayer(panelId, e)) return;
    local.onOpenChange(false);
  }

  // Registering and unregistering inside the same effect ties the listeners to
  // the open state and disposes them with the component.
  createEffect(() => {
    if (!local.open) return;
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(claimEscape(panelId, panelRef()));
    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  function handleTriggerClick() {
    local.onOpenChange(!local.open);
  }

  return (
    <span class={cls("so-popover-anchor", local.class)} data-density={local.density} {...others}>
      <button
        ref={triggerRef}
        type="button"
        class="so-popover-trigger"
        aria-expanded={local.open}
        aria-haspopup="dialog"
        aria-controls={local.open ? panelId : undefined}
        onClick={handleTriggerClick}
      >
        {local.children}
      </button>
      <Show when={local.open}>
        <Portal>
          <div
            ref={setPanelRef}
            id={panelId}
            class="so-popover"
            role="dialog"
            tabIndex={-1}
            data-density={local.density}
          >
            {local.content}
          </div>
        </Portal>
      </Show>
    </span>
  );
}
