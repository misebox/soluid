import { For, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { cls } from "./core/utils";
import { createToast } from "./core/createToast";
import type { ToastInput, ToastReturn } from "./core/createToast";

export interface ToastContainerProps {
  position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
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
  const [local] = splitProps(props, ["position"]);
  const store = getGlobalToast();

  return (
    <Portal>
      <div
        class={cls(
          "so-toast-container",
          `so-toast-container--${local.position ?? "top-right"}`,
        )}
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
                aria-label="Dismiss"
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
