import { splitProps } from "solid-js";
import type { CommonProps, FeedbackVariant } from "./core/types";
import { cls } from "./core/utils";

export interface ProgressProps extends CommonProps {
  value: number;
  variant?: FeedbackVariant;
  size?: "sm" | "md";
}

export function Progress(props: ProgressProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "value",
    "variant",
    "size",
  ]);

  const clampedValue = () => Math.max(0, Math.min(100, local.value));

  return (
    <div
      class={cls(
        "so-progress",
        `so-progress--${local.variant ?? "info"}`,
        `so-progress--${local.size ?? "md"}`,
        local.class,
      )}
      role="progressbar"
      aria-valuenow={clampedValue()}
      aria-valuemin={0}
      aria-valuemax={100}
      data-density={local.density}
      {...others}
    >
      <div
        class="so-progress__bar"
        style={{ width: `${clampedValue()}%` }}
      />
    </div>
  );
}
