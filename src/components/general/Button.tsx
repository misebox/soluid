import { splitProps, Show } from "solid-js";
import type { JSX } from "solid-js";
import type { VariantProps, ButtonVariant } from "../../core/types";
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
        "soui-button",
        `soui-button--${local.variant ?? "neutral"}`,
        `soui-button--${local.size ?? "md"}`,
        local.loading && "soui-button--loading",
        local.class,
      )}
      disabled={local.disabled || local.loading}
      {...others}
    >
      <Show when={local.loading}>
        <span class="soui-button__spinner" aria-hidden="true" />
      </Show>
      <Show when={local.iconLeft}>
        <span class="soui-button__icon" aria-hidden="true">
          {local.iconLeft}
        </span>
      </Show>
      {local.children}
      <Show when={local.iconRight}>
        <span class="soui-button__icon" aria-hidden="true">
          {local.iconRight}
        </span>
      </Show>
    </button>
  );
}
