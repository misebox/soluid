import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import type { Placement } from "@floating-ui/dom";
import { createEffect, createSignal, createUniqueId, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface PopoverProps extends CommonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: Placement;
  children: JSX.Element;
  content: JSX.Element;
}

export function Popover(props: PopoverProps) {
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
    });
  }

  // Keep the panel anchored for as long as it is open. A one-shot
  // computePosition would drift on scroll, resize or layout changes.
  createEffect(() => {
    const panel = panelRef();
    if (!local.open || !triggerRef || !panel) return;
    onCleanup(autoUpdate(triggerRef, panel, updatePosition));
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      local.onOpenChange(false);
      triggerRef?.focus();
    }
  }

  function handleClickOutside(e: MouseEvent) {
    const panel = panelRef();
    const target = e.target as Node;
    if (triggerRef?.contains(target)) return;
    if (panel?.contains(target)) return;
    local.onOpenChange(false);
  }

  // Registering and unregistering inside the same effect ties the listeners to
  // the open state and disposes them with the component.
  createEffect(() => {
    if (!local.open) return;
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
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
          <div ref={setPanelRef} id={panelId} class="so-popover" role="dialog">
            {local.content}
          </div>
        </Portal>
      </Show>
    </span>
  );
}
