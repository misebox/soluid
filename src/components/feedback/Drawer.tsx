import { splitProps, Show, createSignal, createEffect, on } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import { createFocusTrap } from "../../primitives/createFocusTrap";
import "./Drawer.css";

export interface DrawerProps extends CommonProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg";
  children: JSX.Element;
}

export function Drawer(props: DrawerProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "open",
    "onClose",
    "side",
    "size",
    "children",
  ]);

  const [mounted, setMounted] = createSignal(false);
  const [closing, setClosing] = createSignal(false);

  createEffect(
    on(
      () => local.open,
      (open) => {
        if (open) {
          setClosing(false);
          setMounted(true);
        } else if (mounted()) {
          setClosing(true);
        }
      },
    ),
  );

  function handleAnimationEnd() {
    if (closing()) {
      setMounted(false);
      setClosing(false);
    }
  }

  const [containerRef, setContainerRef] = createSignal<HTMLElement | undefined>(
    undefined,
  );

  createFocusTrap({
    container: containerRef,
    isActive: () => local.open,
    onClose: () => local.onClose(),
  });

  function handleBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      local.onClose();
    }
  }

  return (
    <Show when={mounted()}>
      <Portal>
        <div
          class={cls(
            "soui-drawer-backdrop",
            closing() && "soui-drawer-backdrop--closing",
          )}
          onClick={handleBackdropClick}
          onAnimationEnd={handleAnimationEnd}
        >
          <div
            ref={setContainerRef}
            class={cls(
              "soui-drawer",
              `soui-drawer--${local.side ?? "right"}`,
              `soui-drawer--${local.size ?? "md"}`,
              closing() && "soui-drawer--closing",
              local.class,
            )}
            role="dialog"
            aria-modal="true"
            data-density={local.density}
            {...others}
          >
            {local.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
