import {
  createContext,
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { createOverlay } from "./core/createOverlay";
import type { CommonProps, Size } from "./core/types";
import { cls } from "./core/utils";

interface DialogIds {
  titleId: string;
  descriptionId: string;
  /** Set by DialogDescription, so aria-describedby only points at an element that exists. */
  setDescribed: (present: boolean) => void;
}

const DialogContext = createContext<DialogIds>();

/** Native div attributes minus the dialog semantics this component owns. */
type DialogAttributes = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "role" | "aria-modal" | "aria-labelledby" | "aria-describedby"
>;

export interface DialogProps extends CommonProps {
  open: boolean;
  onClose: () => void;
  size?: Size;
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

export interface DialogDescriptionProps {
  class?: string;
  children: JSX.Element;
}

export function Dialog(props: DialogProps & DialogAttributes) {
  const [local, others] = splitProps(props, ["class", "density", "open", "onClose", "size", "children"]);

  const id = createUniqueId();
  const titleId = `so-dialog-title-${id}`;
  const descriptionId = `so-dialog-description-${id}`;
  const [described, setDescribed] = createSignal(false);

  const overlay = createOverlay({
    isOpen: () => local.open,
    onClose: () => local.onClose(),
  });

  return (
    <Show when={overlay.mounted()}>
      <Portal>
        <DialogContext.Provider value={{ titleId, descriptionId, setDescribed }}>
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
              aria-describedby={described() ? descriptionId : undefined}
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

export function DialogHeader(props: DialogHeaderProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "id">) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const ids = useContext(DialogContext);

  return (
    <div id={ids?.titleId} class={cls("so-dialog__header", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function DialogBody(props: DialogBodyProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("so-dialog__body", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function DialogFooter(props: DialogFooterProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("so-dialog__footer", local.class)} {...others}>
      {local.children}
    </div>
  );
}

/**
 * A sentence naming what the dialog is for, wired to aria-describedby.
 *
 * Screen readers announce the title on open; without a description the user
 * hears the name of the dialog and nothing about what it does.
 */
export function DialogDescription(
  props: DialogDescriptionProps & Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "id">,
) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const ids = useContext(DialogContext);

  onMount(() => ids?.setDescribed(true));
  onCleanup(() => ids?.setDescribed(false));

  return (
    <p id={ids?.descriptionId} class={cls("so-dialog__description", local.class)} {...others}>
      {local.children}
    </p>
  );
}
