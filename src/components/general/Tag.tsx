import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Variant } from "../../core/types";
import { cls } from "../../core/utils";
import "./Tag.css";

export interface TagProps extends CommonProps {
  variant?: Variant;
  fill?: "subtle" | "solid";
  size?: "sm" | "md";
  onRemove?: () => void;
  children: JSX.Element;
}

export function Tag(
  props: TagProps & JSX.HTMLAttributes<HTMLSpanElement>,
) {
  const [local, others] = splitProps(props, [
    "class",
    "variant",
    "fill",
    "size",
    "onRemove",
    "children",
  ]);

  return (
    <span
      class={cls(
        "so-tag",
        `so-tag--${local.variant ?? "neutral"}`,
        `so-tag--${local.size ?? "md"}`,
        local.fill === "solid" && "so-tag--solid",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <Show when={local.onRemove}>
        <button
          type="button"
          class="so-tag__remove"
          aria-label="Remove"
          onClick={local.onRemove}
        >
          &#x2715;
        </button>
      </Show>
    </span>
  );
}
