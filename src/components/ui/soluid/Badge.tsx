import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Fill, SmallSize, Variant } from "./core/types";
import { cls } from "./core/utils";

export interface BadgeProps extends CommonProps {
  variant?: Variant;
  fill?: Fill;
  size?: SmallSize;
  children: JSX.Element;
}

export function Badge(props: BadgeProps & JSX.HTMLAttributes<HTMLSpanElement>) {
  const [local, others] = splitProps(props, ["class", "density", "variant", "fill", "size", "children"]);

  return (
    <span
      class={cls(
        "so-badge",
        `so-badge--${local.variant ?? "neutral"}`,
        `so-badge--${local.size ?? "md"}`,
        local.fill === "solid" && "so-badge--solid",
        local.class,
      )}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </span>
  );
}
