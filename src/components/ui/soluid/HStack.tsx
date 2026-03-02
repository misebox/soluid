import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface HStackProps extends CommonProps {
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "start" | "center" | "end" | "stretch";
  wrap?: boolean;
  children: JSX.Element;
}

export function HStack(props: HStackProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "gap",
    "align",
    "wrap",
    "children",
  ]);

  return (
    <div
      class={cls(
        "so-hstack",
        local.gap !== undefined && `so-hstack--gap-${local.gap}`,
        local.align && `so-hstack--align-${local.align}`,
        local.wrap && "so-hstack--wrap",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}
