import { splitProps } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface SkeletonProps extends CommonProps {
  variant?: "text" | "circle" | "rect";
  width?: string;
  height?: string;
}

export function Skeleton(props: SkeletonProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "variant",
    "width",
    "height",
  ]);

  return (
    <div
      class={cls(
        "so-skeleton",
        `so-skeleton--${local.variant ?? "text"}`,
        local.class,
      )}
      data-density={local.density}
      style={{
        width: local.width,
        height: local.height,
      }}
      aria-hidden="true"
      {...others}
    />
  );
}
