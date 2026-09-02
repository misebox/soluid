import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Size, Variant } from "./core/types";
import { cls } from "./core/utils";

export interface SpinnerProps extends CommonProps {
  size?: Size;
  variant?: Variant;
  /** Accessible label announced while loading (default: "Loading") */
  label?: string;
}

export function Spinner(props: SpinnerProps & Omit<JSX.HTMLAttributes<HTMLSpanElement>, "role" | "aria-label">) {
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
