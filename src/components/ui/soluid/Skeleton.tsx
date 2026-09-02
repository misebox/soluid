import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export type SkeletonVariant = "text" | "circle" | "rect";

export interface SkeletonProps extends CommonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
}

// style is omitted because the sizing is set after the spread; aria-hidden
// because a placeholder is always decorative.
export function Skeleton(props: SkeletonProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "style" | "aria-hidden">) {
  const [local, others] = splitProps(props, ["class", "density", "variant", "width", "height"]);

  return (
    <div
      class={cls("so-skeleton", `so-skeleton--${local.variant ?? "text"}`, local.class)}
      data-density={local.density}
      aria-hidden="true"
      {...others}
      // Set after the spread so a caller cannot drop the sizing this needs.
      style={{
        width: local.width,
        height: local.height,
      }}
    />
  );
}
