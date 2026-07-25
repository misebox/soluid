import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface TextProps extends CommonProps {
  /** Element to render (default: "p") */
  as?: "p" | "span" | "div" | "small" | "label";
  size?: "xs" | "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Colour role (default: "default") */
  tone?: "default" | "muted" | "primary" | "danger" | "success" | "warning" | "info";
  align?: "start" | "center" | "end";
  /** Clamp to a single line with an ellipsis */
  truncate?: boolean;
  children: JSX.Element;
}

export function Text(props: TextProps & JSX.HTMLAttributes<HTMLElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "as",
    "size",
    "weight",
    "tone",
    "align",
    "truncate",
    "children",
  ]);

  return (
    <Dynamic
      component={local.as ?? "p"}
      class={cls(
        "so-text",
        `so-text--${local.size ?? "md"}`,
        `so-text--weight-${local.weight ?? "normal"}`,
        `so-text--tone-${local.tone ?? "default"}`,
        local.align && `so-text--align-${local.align}`,
        local.truncate && "so-text--truncate",
        local.class,
      )}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
}
