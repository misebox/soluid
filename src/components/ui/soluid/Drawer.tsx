import { createContext, createUniqueId, Show, splitProps, useContext } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { createOverlay } from "./core/createOverlay";
import type { CommonProps, Size } from "./core/types";
import { cls } from "./core/utils";

const DrawerContext = createContext<string>();

export type DrawerSide = "left" | "right";

export interface DrawerProps extends CommonProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: Size;
  children: JSX.Element;
}

export interface DrawerHeaderProps {
  class?: string;
  children: JSX.Element;
}

export function Drawer(props: DrawerProps) {
  const [local, others] = splitProps(props, ["class", "density", "open", "onClose", "side", "size", "children"]);

  const titleId = `so-drawer-title-${createUniqueId()}`;

  const overlay = createOverlay({
    isOpen: () => local.open,
    onClose: () => local.onClose(),
  });

  return (
    <Show when={overlay.mounted()}>
      <Portal>
        <DrawerContext.Provider value={titleId}>
          <div
            class={cls("so-drawer-backdrop", overlay.closing() && "so-drawer-backdrop--closing")}
            on:mousedown={overlay.handleBackdropMouseDown}
            on:click={overlay.handleBackdropClick}
            onAnimationEnd={overlay.handleAnimationEnd}
          >
            <div
              ref={overlay.setContainerRef}
              class={cls(
                "so-drawer",
                `so-drawer--${local.side ?? "right"}`,
                `so-drawer--${local.size ?? "md"}`,
                overlay.closing() && "so-drawer--closing",
                local.class,
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              data-density={local.density}
              {...others}
            >
              {local.children}
            </div>
          </div>
        </DrawerContext.Provider>
      </Portal>
    </Show>
  );
}

export function DrawerHeader(props: DrawerHeaderProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const titleId = useContext(DrawerContext);

  return (
    <div id={titleId} class={cls("so-drawer__header", local.class)} {...others}>
      {local.children}
    </div>
  );
}
