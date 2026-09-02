import { For, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { createToast } from "./core/createToast";
import type { ToastInput, ToastReturn } from "./core/createToast";
import { cls } from "./core/utils";

export type ToastPosition = "top-right" | "top-center" | "bottom-right" | "bottom-center";

// The live-region attributes are the container's own.
export interface ToastContainerProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "aria-live" | "aria-relevant"
> {
  position?: ToastPosition;
  /** Accessible label for each toast's dismiss button (default: "Dismiss") */
  dismissLabel?: string;
}

// Global toast store
let globalToast: ToastReturn | undefined;

function getGlobalToast(): ToastReturn {
  if (!globalToast) {
    globalToast = createToast();
  }
  return globalToast;
}

export function useToast() {
  const store = getGlobalToast();
  return {
    add: (input: ToastInput) => store.add(input),
    dismiss: (id: string) => store.dismiss(id),
  };
}

export function ToastContainer(props: ToastContainerProps) {
  const [local, others] = splitProps(props, ["position", "class", "dismissLabel"]);
  const store = getGlobalToast();

  return (
    <Portal>
      <div
        {...others}
        class={cls("so-toast-container", `so-toast-container--${local.position ?? "top-right"}`, local.class)}
        aria-live="polite"
        aria-relevant="additions"
      >
        <For each={store.toasts}>
          {(toast) => (
            <div
              class={cls(
                "so-toast",
                `so-toast--${toast.variant ?? "info"}`,
                toast.dismissing && "so-toast--dismissing",
              )}
              role={toast.variant === "danger" || toast.variant === "warning" ? "alert" : "status"}
            >
              <span class="so-toast__message">{toast.message}</span>
              <button
                type="button"
                class="so-toast__dismiss"
                onClick={() => store.dismiss(toast.id)}
                aria-label={local.dismissLabel ?? "Dismiss"}
              >
                &times;
              </button>
            </div>
          )}
        </For>
      </div>
    </Portal>
  );
}
