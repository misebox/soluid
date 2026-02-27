import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./Stack.css";

export interface StackProps extends CommonProps {
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "start" | "center" | "end" | "stretch";
  children: JSX.Element;
}

export function Stack(props: StackProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "gap",
    "align",
    "children",
  ]);

  return (
    <div
      class={cls(
        "soui-stack",
        local.gap !== undefined && `soui-stack--gap-${local.gap}`,
        local.align && `soui-stack--align-${local.align}`,
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}
