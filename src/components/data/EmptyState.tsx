import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./EmptyState.css";

export interface EmptyStateProps extends CommonProps {
  title: string;
  description?: string;
  icon?: JSX.Element;
  action?: JSX.Element;
}

export function EmptyState(props: EmptyStateProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "title",
    "description",
    "icon",
    "action",
  ]);

  return (
    <div
      class={cls("so-empty-state", local.class)}
      data-density={local.density}
      {...others}
    >
      <Show when={local.icon}>
        <div class="so-empty-state__icon">{local.icon}</div>
      </Show>
      <h3 class="so-empty-state__title">{local.title}</h3>
      <Show when={local.description}>
        <p class="so-empty-state__description">{local.description}</p>
      </Show>
      <Show when={local.action}>
        <div class="so-empty-state__action">{local.action}</div>
      </Show>
    </div>
  );
}
