import { getOwner, onCleanup } from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { FeedbackVariant } from "./types";

const EXIT_DURATION = 150;

export interface Toast {
  id: string;
  message: string;
  variant?: FeedbackVariant;
  duration?: number;
  dismissing?: boolean;
}

export interface ToastOptions {
  /** Default auto-dismiss duration in ms (default: 5000) */
  defaultDuration?: number;
}

export interface ToastInput {
  message: string;
  variant?: FeedbackVariant;
  /** Duration in ms. Set to 0 to disable auto-dismiss. */
  duration?: number;
}

export interface ToastReturn {
  toasts: Toast[];
  add: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

let toastCounter = 0;

export function createToast(options: ToastOptions = {}): ToastReturn {
  const defaultDuration = options.defaultDuration ?? 5000;
  const [toasts, setToasts] = createStore<Toast[]>([]);
  // Plain timers: a scheduled primitive registers its clear on whatever owner
  // `add` runs under, so a toast added from an effect would lose its
  // auto-dismiss when that effect re-ran or unmounted.
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function remove(id: string): void {
    setToasts(
      produce((list) => {
        const idx = list.findIndex((t) => t.id === id);
        if (idx !== -1) {
          list.splice(idx, 1);
        }
      }),
    );
  }

  function dismiss(id: string): void {
    const timer = timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.delete(id);
    }

    // Mark as dismissing for exit animation
    setToasts(
      produce((list) => {
        const toast = list.find((t) => t.id === id);
        if (toast) {
          toast.dismissing = true;
        }
      }),
    );

    // Remove after exit animation
    setTimeout(() => remove(id), EXIT_DURATION);
  }

  // Timers outlive the store otherwise, and fire into a disposed component.
  if (getOwner()) {
    onCleanup(() => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    });
  }

  function add(input: ToastInput): string {
    toastCounter += 1;
    const id = `so-toast-${toastCounter}`;
    const duration = input.duration ?? defaultDuration;

    const toast: Toast = {
      id,
      message: input.message,
      variant: input.variant,
      duration,
    };

    setToasts(
      produce((list) => {
        list.push(toast);
      }),
    );

    if (duration > 0) {
      timers.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
    }

    return id;
  }

  return {
    toasts,
    add,
    dismiss,
  };
}
