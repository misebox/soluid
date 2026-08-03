import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls, mergeStyle } from "./core/utils";

export interface AspectRatioProps extends CommonProps {
  /** Width divided by height, e.g. 16 / 9 (default: 1) */
  ratio?: number;
  children: JSX.Element;
}

export function AspectRatio(props: AspectRatioProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "density", "ratio", "children", "style"]);

  return (
    <div
      class={cls("so-aspect-ratio", local.class)}
      style={mergeStyle({ "aspect-ratio": String(local.ratio ?? 1) }, local.style)}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </div>
  );
}
