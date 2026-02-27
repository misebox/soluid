import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./HStack.css";

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
        "soui-hstack",
        local.gap !== undefined && `soui-hstack--gap-${local.gap}`,
        local.align && `soui-hstack--align-${local.align}`,
        local.wrap && "soui-hstack--wrap",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}
