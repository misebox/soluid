import { createContext, createEffect, createSignal, on, Show, splitProps, useContext } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { createFocusTrap } from "./core/createFocusTrap";

let dialogCounter = 0;

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
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "open",
    "onClose",
    "size",
    "children",
  ]);

  dialogCounter += 1;
  const titleId = `so-dialog-title-${dialogCounter}`;

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
        <DialogContext.Provider value={titleId}>
          <div
            class={cls(
              "so-dialog-backdrop",
              closing() && "so-dialog-backdrop--closing",
            )}
            onClick={handleBackdropClick}
            onAnimationEnd={handleAnimationEnd}
          >
            <div
              ref={setContainerRef}
              class={cls(
                "so-dialog",
                `so-dialog--${local.size ?? "md"}`,
                closing() && "so-dialog--closing",
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
