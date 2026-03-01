import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { ButtonVariant, VariantProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./Button.css";

export interface ButtonProps extends VariantProps<ButtonVariant> {
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  loading?: boolean;
  children: JSX.Element;
}

export function Button(
  props: ButtonProps & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const [local, others] = splitProps(props, [
    "class",
    "variant",
    "size",
    "disabled",
    "iconLeft",
    "iconRight",
    "loading",
    "children",
  ]);

  return (
    <button
      class={cls(
        "so-button",
        `so-button--${local.variant ?? "neutral"}`,
        `so-button--${local.size ?? "md"}`,
        local.loading && "so-button--loading",
        local.class,
      )}
      disabled={local.disabled || local.loading}
      {...others}
    >
      <Show when={local.loading}>
        <span class="so-button__spinner" aria-hidden="true" />
      </Show>
      <Show when={local.iconLeft}>
        <span class="so-button__icon" aria-hidden="true">
          {local.iconLeft}
        </span>
      </Show>
      {local.children}
      <Show when={local.iconRight}>
        <span class="so-button__icon" aria-hidden="true">
          {local.iconRight}
        </span>
      </Show>
    </button>
  );
}
