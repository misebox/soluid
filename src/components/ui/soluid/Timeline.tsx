import { For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, FeedbackVariant } from "./core/types";
import { cls } from "./core/utils";

export interface TimelineItem {
  title: string;
  description?: JSX.Element;
  /** Formatted timestamp; pass a machine-readable `dateTime` alongside it */
  timestamp?: string;
  /** ISO 8601 value for the <time> element */
  dateTime?: string;
  variant?: FeedbackVariant;
  icon?: JSX.Element;
}

export interface TimelineProps extends CommonProps {
  items: TimelineItem[];
}

export function Timeline(props: TimelineProps & JSX.HTMLAttributes<HTMLOListElement>) {
  const [local, others] = splitProps(props, ["class", "density", "items"]);

  return (
    <ol class={cls("so-timeline", local.class)} data-density={local.density} {...others}>
      <For each={local.items}>
        {(item) => (
          <li class={cls("so-timeline__item", `so-timeline__item--${item.variant ?? "info"}`)}>
            <span class="so-timeline__marker" aria-hidden="true">
              {item.icon}
            </span>
            <div class="so-timeline__body">
              <div class="so-timeline__heading">
                <span class="so-timeline__title">{item.title}</span>
                <Show when={item.timestamp}>
                  {(timestamp) => (
                    <time class="so-timeline__timestamp" datetime={item.dateTime}>
                      {timestamp()}
                    </time>
                  )}
                </Show>
              </div>
              <Show when={item.description}>
                <div class="so-timeline__description">{item.description}</div>
              </Show>
            </div>
          </li>
        )}
      </For>
    </ol>
  );
}
