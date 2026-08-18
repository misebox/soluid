import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { CommonProps, TextAlign } from "./core/types";
import { cls } from "./core/utils";

export type TextElement = "p" | "span" | "div" | "small" | "label";
export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextTone = "default" | "muted" | "primary" | "danger" | "success" | "warning" | "info";

export interface TextProps extends CommonProps {
  /** Element to render (default: "p") */
  as?: TextElement;
  size?: TextSize;
  weight?: TextWeight;
  /** Colour role (default: "default") */
  tone?: TextTone;
  align?: TextAlign;
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
