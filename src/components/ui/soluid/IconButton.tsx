import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { ButtonVariant, VariantProps } from "./core/types";
import { cls } from "./core/utils";

export interface IconButtonProps extends VariantProps<ButtonVariant> {
  icon: JSX.Element;
  "aria-label": string;
}

export function IconButton(props: IconButtonProps & JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [local, others] = splitProps(props, ["class", "density", "variant", "size", "disabled", "icon"]);

  return (
    <button
      // Default to "button" so an IconButton inside a <form> does not submit it.
      type="button"
      class={cls(
        "so-icon-button",
        `so-icon-button--${local.variant ?? "neutral"}`,
        `so-icon-button--${local.size ?? "md"}`,
        local.class,
      )}
      disabled={local.disabled}
      data-density={local.density}
      {...others}
    >
      {local.icon}
    </button>
  );
}
