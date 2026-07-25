import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Visual size each level falls back to when `size` is not given. */
const SIZE_FOR_LEVEL: Record<HeadingLevel, string> = {
  1: "3xl",
  2: "2xl",
  3: "xl",
  4: "lg",
  5: "md",
  6: "sm",
};

export interface HeadingProps extends CommonProps {
  /** Document outline level, rendered as h1-h6 (default: 2) */
  level?: HeadingLevel;
  /** Visual size, decoupled from `level` so the outline stays correct */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  children: JSX.Element;
}

export function Heading(props: HeadingProps & JSX.HTMLAttributes<HTMLHeadingElement>) {
  const [local, others] = splitProps(props, ["class", "density", "level", "size", "children"]);

  const level = () => local.level ?? 2;

  return (
    <Dynamic
      component={`h${level()}`}
      class={cls("so-heading", `so-heading--${local.size ?? SIZE_FOR_LEVEL[level()]}`, local.class)}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
}
