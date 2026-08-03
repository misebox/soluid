import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls, mergeStyle } from "./core/utils";

export interface GridProps extends CommonProps {
  /** Fixed column count. Ignored when `minItemWidth` is set. */
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  /**
   * Responsive mode: fit as many columns as possible, each at least this wide
   * (any CSS length, e.g. "16rem"). Takes precedence over `columns`.
   */
  minItemWidth?: string;
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "start" | "center" | "end" | "stretch";
  children: JSX.Element;
}

export function Grid(props: GridProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "columns",
    "minItemWidth",
    "gap",
    "align",
    "children",
    "style",
  ]);

  // min() keeps a single narrow item from overflowing its container.
  const autoColumns = () =>
    local.minItemWidth ? `repeat(auto-fit, minmax(min(${local.minItemWidth}, 100%), 1fr))` : undefined;

  return (
    <div
      class={cls(
        "so-grid",
        local.minItemWidth === undefined && `so-grid--cols-${local.columns ?? 1}`,
        local.gap !== undefined && `so-grid--gap-${local.gap}`,
        local.align && `so-grid--align-${local.align}`,
        local.class,
      )}
      style={mergeStyle({ "grid-template-columns": autoColumns() }, local.style)}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </div>
  );
}
