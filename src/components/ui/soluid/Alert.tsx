import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, FeedbackVariant } from "./core/types";
import { cls } from "./core/utils";

export interface AlertProps extends CommonProps {
  variant?: FeedbackVariant;
  children: JSX.Element;
  onDismiss?: () => void;
}

export function Alert(props: AlertProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "variant",
    "children",
    "onDismiss",
  ]);

  return (
    <div
      class={cls(
        "so-alert",
        `so-alert--${local.variant ?? "info"}`,
        local.class,
      )}
      role="alert"
      data-density={local.density}
      {...others}
    >
      <div class="so-alert__content">{local.children}</div>
      <Show when={local.onDismiss}>
        <button
          type="button"
          class="so-alert__dismiss"
          onClick={() => local.onDismiss?.()}
          aria-label="Dismiss"
        >
          &times;
        </button>
      </Show>
    </div>
  );
}
