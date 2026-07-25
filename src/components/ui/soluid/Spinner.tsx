import { splitProps } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface SpinnerProps extends CommonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "neutral" | "danger" | "success" | "warning" | "info";
  /** Accessible label announced while loading (default: "Loading") */
  label?: string;
}

export function Spinner(props: SpinnerProps) {
  const [local, others] = splitProps(props, ["class", "density", "size", "variant", "label"]);

  return (
    <span
      class={cls(
        "so-spinner",
        `so-spinner--${local.size ?? "md"}`,
        `so-spinner--${local.variant ?? "primary"}`,
        local.class,
      )}
      role="status"
      aria-label={local.label ?? "Loading"}
      data-density={local.density}
      {...others}
    />
  );
}
