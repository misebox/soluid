import { createContext, createUniqueId, Show, splitProps, useContext } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { createOverlay } from "./core/createOverlay";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

const DialogContext = createContext<string>();

export interface DialogProps extends CommonProps {
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
  children: JSX.Element;
}

export interface DialogHeaderProps {
  class?: string;
  children: JSX.Element;
}

export interface DialogBodyProps {
  class?: string;
  children: JSX.Element;
}

export interface DialogFooterProps {
  class?: string;
  children: JSX.Element;
}

export function Dialog(props: DialogProps) {
  const [local, others] = splitProps(props, ["class", "density", "open", "onClose", "size", "children"]);

  const titleId = `so-dialog-title-${createUniqueId()}`;

  const overlay = createOverlay({
    isOpen: () => local.open,
    onClose: () => local.onClose(),
  });

  return (
    <Show when={overlay.mounted()}>
      <Portal>
        <DialogContext.Provider value={titleId}>
          <div
            class={cls("so-dialog-backdrop", overlay.closing() && "so-dialog-backdrop--closing")}
            on:mousedown={overlay.handleBackdropMouseDown}
            on:click={overlay.handleBackdropClick}
            onAnimationEnd={overlay.handleAnimationEnd}
          >
            <div
              ref={overlay.setContainerRef}
              class={cls(
                "so-dialog",
                `so-dialog--${local.size ?? "md"}`,
                overlay.closing() && "so-dialog--closing",
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
        </DialogContext.Provider>
      </Portal>
    </Show>
  );
}

export function DialogHeader(props: DialogHeaderProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const titleId = useContext(DialogContext);

  return (
    <div id={titleId} class={cls("so-dialog__header", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function DialogBody(props: DialogBodyProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("so-dialog__body", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function DialogFooter(props: DialogFooterProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("so-dialog__footer", local.class)} {...others}>
      {local.children}
    </div>
  );
}
