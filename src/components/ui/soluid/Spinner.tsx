import { splitProps } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface SpinnerProps extends CommonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "neutral";
}

export function Spinner(props: SpinnerProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "size",
    "variant",
  ]);

  return (
    <span
      class={cls(
        "so-spinner",
        `so-spinner--${local.size ?? "md"}`,
        `so-spinner--${local.variant ?? "primary"}`,
        local.class,
      )}
      role="status"
      aria-label="Loading"
      data-density={local.density}
      {...others}
    />
  );
}
