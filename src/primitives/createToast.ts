import { createStore, produce } from "solid-js/store";
import { debounce } from "@solid-primitives/scheduled";
import type { FeedbackVariant } from "../core/types";

export interface Toast {
  id: string;
  message: string;
  variant?: FeedbackVariant;
  duration?: number;
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
  const timers = new Map<string, ReturnType<typeof debounce>>();

  function dismiss(id: string): void {
    const timer = timers.get(id);
    if (timer) {
      timer.clear();
      timers.delete(id);
    }
    setToasts(produce((list) => {
      const idx = list.findIndex((t) => t.id === id);
      if (idx !== -1) {
        list.splice(idx, 1);
      }
    }));
  }

  function add(input: ToastInput): string {
    toastCounter += 1;
    const id = `soui-toast-${toastCounter}`;
    const duration = input.duration ?? defaultDuration;

    const toast: Toast = {
      id,
      message: input.message,
      variant: input.variant,
      duration,
    };

    setToasts(produce((list) => {
      list.push(toast);
    }));

    if (duration > 0) {
      const scheduledDismiss = debounce(() => dismiss(id), duration);
      timers.set(id, scheduledDismiss);
      scheduledDismiss();
    }

    return id;
  }

  return {
    toasts,
    add,
    dismiss,
  };
}
