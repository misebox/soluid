import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Variant } from "./core/types";
import { cls } from "./core/utils";

export interface BadgeProps extends CommonProps {
  variant?: Variant;
  fill?: "subtle" | "solid";
  size?: "sm" | "md";
  children: JSX.Element;
}

export function Badge(
  props: BadgeProps & JSX.HTMLAttributes<HTMLSpanElement>,
) {
  const [local, others] = splitProps(props, [
    "class",
    "variant",
    "fill",
    "size",
    "children",
  ]);

  return (
    <span
      class={cls(
        "so-badge",
        `so-badge--${local.variant ?? "neutral"}`,
        `so-badge--${local.size ?? "md"}`,
        local.fill === "solid" && "so-badge--solid",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </span>
  );
}
