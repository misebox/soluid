import { splitProps } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export type SkeletonVariant = "text" | "circle" | "rect";

export interface SkeletonProps extends CommonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
}

export function Skeleton(props: SkeletonProps) {
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
