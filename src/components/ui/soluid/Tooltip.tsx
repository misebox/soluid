import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { cls } from "./core/utils";

let tooltipCounter = 0;

export interface TooltipProps {
  content?: string;
  placement?: "top" | "bottom" | "left" | "right";
  class?: string;
  children: JSX.Element;
}

export function Tooltip(props: TooltipProps) {
  const [local, others] = splitProps(props, [
    "content",
    "placement",
    "class",
    "children",
  ]);

  tooltipCounter += 1;
  const tooltipId = `so-tooltip-${tooltipCounter}`;

  return (
    <Show when={local.content} fallback={<>{local.children}</>}>
      <span
        class={cls("so-tooltip-wrapper", local.class)}
        {...others}
      >
        <span aria-describedby={tooltipId}>
          {local.children}
        </span>
        <span
          id={tooltipId}
          class={cls(
            "so-tooltip",
            `so-tooltip--${local.placement ?? "top"}`,
          )}
          role="tooltip"
        >
          {local.content}
        </span>
      </span>
    </Show>
  );
}
