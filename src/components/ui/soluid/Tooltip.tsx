import { children, createEffect, createUniqueId, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { cls } from "./core/utils";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content?: string;
  placement?: TooltipPlacement;
  class?: string;
  children: JSX.Element;
}

export function Tooltip(props: TooltipProps & JSX.HTMLAttributes<HTMLSpanElement>) {
  const [local, others] = splitProps(props, ["content", "placement", "class", "children"]);

  const tooltipId = `so-tooltip-${createUniqueId()}`;
  const trigger = children(() => local.children);

  // Point aria-describedby at the resolved trigger element rather than at a
  // wrapper span: only the trigger takes focus, so only it can announce the
  // description to a screen reader.
  createEffect(() => {
    const describedBy = local.content ? tooltipId : undefined;
    for (const node of trigger.toArray()) {
      if (!(node instanceof HTMLElement)) continue;
      if (describedBy) node.setAttribute("aria-describedby", describedBy);
      else node.removeAttribute("aria-describedby");
    }
  });

  // The wrapper stays put whether or not there is content: swapping the trigger
  // between two parents would blur it.
  return (
    <span class={cls("so-tooltip-wrapper", local.class)} {...others}>
      {trigger()}
      <Show when={local.content}>
        <span id={tooltipId} class={cls("so-tooltip", `so-tooltip--${local.placement ?? "top"}`)} role="tooltip">
          {local.content}
        </span>
      </Show>
    </span>
  );
}
