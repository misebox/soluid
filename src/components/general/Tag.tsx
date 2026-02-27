import { splitProps, Show } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Variant } from "../../core/types";
import { cls } from "../../core/utils";
import "./Tag.css";

export interface TagProps extends CommonProps {
  variant?: Variant;
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
    "size",
    "onRemove",
    "children",
  ]);

  return (
    <span
      class={cls(
        "soui-tag",
        `soui-tag--${local.variant ?? "neutral"}`,
        `soui-tag--${local.size ?? "md"}`,
        local.class,
      )}
      {...others}
    >
      {local.children}
      <Show when={local.onRemove}>
        <button
          type="button"
          class="soui-tag__remove"
          aria-label="Remove"
          onClick={local.onRemove}
        >
          &#x2715;
        </button>
      </Show>
    </span>
  );
}
