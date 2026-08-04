import { autoUpdate, computePosition, flip, shift } from "@floating-ui/dom";
import type { VirtualElement } from "@floating-ui/dom";
import { createEffect, createSignal, createUniqueId, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
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

export function ContextMenu(props: ContextMenuProps & JSX.HTMLAttributes<HTMLDivElement>) {
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
    setOpen(false);
    region?.focus();
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
    });
  }

  createEffect(() => {
    const panel = panelRef();
    const reference = anchor();
    if (!open() || !panel || !reference) return;
    onCleanup(autoUpdate(reference, panel, updatePosition));
    panel.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus();
  });

  function handleKeyDown(e: KeyboardEvent): void {
    const panel = panelRef();
    if (!panel) return;

    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }

    const items = Array.from(panel.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
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
    if (panelRef()?.contains(e.target as Node)) return;
    setOpen(false);
  }

  createEffect(() => {
    if (!open()) return;
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.removeEventListener("mousedown", handlePointerDown);
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
          <div ref={setPanelRef} id={menuId} class="so-context-menu" role="menu" aria-label={local.label}>
            {local.content}
          </div>
        </Portal>
      </Show>
    </div>
  );
}
