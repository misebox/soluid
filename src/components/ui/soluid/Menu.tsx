import { createEffect, createSignal, createUniqueId, on, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import type { Placement } from "@floating-ui/dom";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface MenuProps extends CommonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: Placement;
  trigger: JSX.Element;
  children: JSX.Element;
}

export interface MenuItemProps {
  class?: string;
  disabled?: boolean;
  onSelect?: () => void;
  children: JSX.Element;
}

export interface MenuSeparatorProps {
  class?: string;
}

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

export function Menu(props: MenuProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "open",
    "onOpenChange",
    "placement",
    "trigger",
    "children",
  ]);

  const menuId = `so-menu-${createUniqueId()}`;

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

  createEffect(
    on(
      () => local.open,
      (open) => {
        if (open) {
          requestAnimationFrame(() => {
            updatePosition();
            focusFirstItem();
          });
        }
      },
    ),
  );

  function focusFirstItem() {
    const panel = panelRef();
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(ITEM_SELECTOR);
    first?.focus();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!local.open) return;

    if (e.key === "Escape") {
      e.stopPropagation();
      local.onOpenChange(false);
      triggerRef?.focus();
      return;
    }

    const panel = panelRef();
    if (!panel) return;

    const items = Array.from(panel.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    if (items.length === 0) return;

    const active = document.activeElement as HTMLElement;
    const idx = items.indexOf(active);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = idx < items.length - 1 ? idx + 1 : 0;
      items[next].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = idx > 0 ? idx - 1 : items.length - 1;
      items[prev].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  }

  function handleClickOutside(e: MouseEvent) {
    if (!local.open) return;
    const panel = panelRef();
    const target = e.target as Node;
    if (triggerRef?.contains(target)) return;
    if (panel?.contains(target)) return;
    local.onOpenChange(false);
  }

  createEffect(() => {
    if (local.open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
  });

  function handleTriggerClick() {
    local.onOpenChange(!local.open);
  }

  return (
    <span class={cls("so-menu-anchor", local.class)} data-density={local.density} {...others}>
      <button
        ref={triggerRef}
        type="button"
        class="so-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={local.open}
        aria-controls={local.open ? menuId : undefined}
        onClick={handleTriggerClick}
      >
        {local.trigger}
      </button>
      <Show when={local.open}>
        <Portal>
          <div
            ref={setPanelRef}
            id={menuId}
            class="so-menu"
            role="menu"
          >
            {local.children}
          </div>
        </Portal>
      </Show>
    </span>
  );
}

export function MenuItem(props: MenuItemProps) {
  const [local, others] = splitProps(props, [
    "class",
    "disabled",
    "onSelect",
    "children",
  ]);

  function handleClick() {
    if (!local.disabled) {
      local.onSelect?.();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.key === "Enter" || e.key === " ") && !local.disabled) {
      e.preventDefault();
      local.onSelect?.();
    }
  }

  return (
    <div
      class={cls(
        "so-menu-item",
        local.disabled && "so-menu-item--disabled",
        local.class,
      )}
      role="menuitem"
      tabIndex={local.disabled ? -1 : 0}
      aria-disabled={local.disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...others}
    >
      {local.children}
    </div>
  );
}

export function MenuSeparator(props: MenuSeparatorProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={cls("so-menu-separator", local.class)}
      role="separator"
      {...others}
    />
  );
}
