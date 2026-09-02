import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Fill, SmallSize, Variant } from "./core/types";
import { cls } from "./core/utils";

export interface TagProps extends CommonProps {
  variant?: Variant;
  fill?: Fill;
  size?: SmallSize;
  onRemove?: () => void;
  /** Accessible label for the remove button (default: "Remove") */
  removeLabel?: string;
  children: JSX.Element;
}

export function Tag(props: TagProps & JSX.HTMLAttributes<HTMLSpanElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "variant",
    "fill",
    "size",
    "onRemove",
    "removeLabel",
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
      data-density={local.density}
      {...others}
    >
      {local.children}
      <Show when={local.onRemove}>
        <button
          type="button"
          class="so-tag__remove"
          aria-label={local.removeLabel ?? "Remove"}
          onClick={local.onRemove}
        >
          &#x2715;
        </button>
      </Show>
    </span>
  );
}
