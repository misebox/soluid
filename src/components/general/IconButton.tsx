import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { VariantProps, ButtonVariant } from "../../core/types";
import { cls } from "../../core/utils";
import "./IconButton.css";

export interface IconButtonProps extends VariantProps<ButtonVariant> {
  icon: JSX.Element;
  "aria-label": string;
}

export function IconButton(
  props: IconButtonProps & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const [local, others] = splitProps(props, [
    "class",
    "variant",
    "size",
    "disabled",
    "icon",
  ]);

  return (
    <button
      class={cls(
        "soui-icon-button",
        `soui-icon-button--${local.variant ?? "neutral"}`,
        `soui-icon-button--${local.size ?? "md"}`,
        local.class,
      )}
      disabled={local.disabled}
      {...others}
    >
      {local.icon}
    </button>
  );
}
