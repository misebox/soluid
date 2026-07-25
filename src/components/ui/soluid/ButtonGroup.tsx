import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface ButtonGroupProps extends CommonProps {
  orientation?: "horizontal" | "vertical";
  /** Join adjacent buttons into one visual unit (default: true) */
  attached?: boolean;
  /** Accessible label describing what the group of actions is for */
  label?: string;
  children: JSX.Element;
}

export function ButtonGroup(props: ButtonGroupProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "density", "orientation", "attached", "label", "children"]);

  return (
    <div
      class={cls(
        "so-button-group",
        `so-button-group--${local.orientation ?? "horizontal"}`,
        local.attached !== false && "so-button-group--attached",
        local.class,
      )}
      role="group"
      aria-label={local.label}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </div>
  );
}
