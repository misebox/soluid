import { autoUpdate, computePosition, flip, shift } from "@floating-ui/dom";
import type { VirtualElement } from "@floating-ui/dom";
import { createEffect, createSignal, createUniqueId, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { claimEscape, isInsideNewerLayer, takeEscape } from "./core/createFocusTrap";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

export interface ContextMenuProps extends CommonProps {
  /** Menu body — compose from MenuItem and MenuSeparator */
  content: JSX.Element;
  /** Accessible label for the menu */
  label?: string;
  /** Region that responds to a right-click */
  children: JSX.Element;
}

/** Anchors the menu to the pointer position rather than to an element. */
function pointAnchor(x: number, y: number): VirtualElement {
  return {
    getBoundingClientRect: () => ({ x, y, top: y, left: x, right: x, bottom: y, width: 0, height: 0 }),
  };
}

// onContextMenu is omitted because opening the menu is the component's own.
export function ContextMenu(props: ContextMenuProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "onContextMenu">) {
  const [local, others] = splitProps(props, ["class", "density", "content", "label", "children"]);

  const menuId = `so-context-menu-${createUniqueId()}`;

  const [open, setOpen] = createSignal(false);
  const [anchor, setAnchor] = createSignal<VirtualElement | undefined>(undefined);
  const [panelRef, setPanelRef] = createSignal<HTMLDivElement | undefined>(undefined);

  let region: HTMLDivElement | undefined;

  function handleContextMenu(e: MouseEvent): void {
    e.preventDefault();
    setAnchor(pointAnchor(e.clientX, e.clientY));
    setOpen(true);
  }

  function close(): void {
    // Reclaim focus only if it is still ours; a pick may have opened a dialog.
    const active = document.activeElement;
    const focusWithin = !!panelRef()?.contains(active) || active === document.body;
    setOpen(false);
    if (focusWithin) region?.focus();
  }

  function updatePosition(): void {
    const panel = panelRef();
    const reference = anchor();
    if (!panel || !reference) return;
    computePosition(reference, panel, {
      placement: "bottom-start",
      middleware: [flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      // Until this runs the panel sits at the document origin, hidden by the
      // CSS; focusing an item there would scroll the page to the bottom.
      const firstPlacement = panel.dataset.soPlaced === undefined;
      panel.dataset.soPlaced = "";
      if (firstPlacement) panel.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus();
    });
  }

  createEffect(() => {
    const panel = panelRef();
    const reference = anchor();
    if (!open() || !panel || !reference) return;
    onCleanup(autoUpdate(reference, panel, updatePosition));
  });

  function handleKeyDown(e: KeyboardEvent): void {
    const panel = panelRef();
    if (!panel) return;

    if (e.key === "Escape") {
      if (!takeEscape(menuId, e)) return;
      close();
      return;
    }

    if (e.key === "Tab") {
      close();
      return;
    }

    const items = Array.from(panel.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    if (items.length === 0) return;
    // e.target, not activeElement: MenuItem's onSelect has run and may have moved focus.
    const index = items.indexOf(e.target as HTMLElement);

    // MenuItem has already run onSelect for this key; the menu goes away after it.
    if ((e.key === "Enter" || e.key === " ") && index !== -1) {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[index < items.length - 1 ? index + 1 : 0].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[index > 0 ? index - 1 : items.length - 1].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  }

  function handlePointerDown(e: MouseEvent): void {
    if (panelRef()?.contains(e.target as Node) || isInsideNewerLayer(menuId, e)) return;
    setOpen(false);
  }

  createEffect(() => {
    if (!open()) return;
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(claimEscape(menuId, panelRef()));
    onCleanup(() => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div
      ref={region}
      class={cls("so-context-menu-region", local.class)}
      // Focusable so keyboard users can reach the same actions via the
      // context-menu key, which browsers dispatch as a contextmenu event.
      tabIndex={0}
      aria-haspopup="menu"
      // No aria-expanded: it needs a role that supports it, and this region has
      // none. Opening moves focus into the menu, which announces it instead.
      aria-controls={open() ? menuId : undefined}
      data-density={local.density}
      onContextMenu={handleContextMenu}
      {...others}
    >
      {local.children}
      <Show when={open()}>
        <Portal>
          <div
            ref={setPanelRef}
            id={menuId}
            class="so-context-menu"
            role="menu"
            aria-label={local.label}
            tabIndex={-1}
            data-density={local.density}
            // A pick closes the menu; MenuItem has run onSelect by the time this bubbles up.
            onClick={(e) => e.target instanceof Element && e.target.closest(ITEM_SELECTOR) && close()}
          >
            {local.content}
          </div>
        </Portal>
      </Show>
    </div>
  );
}
