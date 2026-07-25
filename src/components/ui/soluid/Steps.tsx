import { For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { VisuallyHidden } from "./VisuallyHidden";

export interface Step {
  label: string;
  description?: string;
}

export interface StepsProps extends CommonProps {
  steps: Step[];
  /** Zero-based index of the active step */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Accessible label for the step list */
  label?: string;
  /** Text announced for steps before the current one (default: "completed") */
  completedLabel?: string;
}

export function Steps(props: StepsProps & JSX.HTMLAttributes<HTMLElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "steps",
    "current",
    "orientation",
    "label",
    "completedLabel",
  ]);

  const stateOf = (index: number) => {
    if (index < local.current) return "complete";
    return index === local.current ? "current" : "upcoming";
  };

  return (
    <nav
      class={cls("so-steps", `so-steps--${local.orientation ?? "horizontal"}`, local.class)}
      aria-label={local.label}
      data-density={local.density}
      {...others}
    >
      <ol class="so-steps__list">
        <For each={local.steps}>
          {(step, i) => (
            <li
              class={cls("so-steps__item", `so-steps__item--${stateOf(i())}`)}
              aria-current={stateOf(i()) === "current" ? "step" : undefined}
            >
              <span class="so-steps__marker" aria-hidden="true">
                <Show when={stateOf(i()) === "complete"} fallback={i() + 1}>
                  <svg viewBox="0 0 12 12" fill="none" class="so-steps__check">
                    <polyline
                      points="2,6 5,9 10,3"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Show>
              </span>
              <span class="so-steps__body">
                <span class="so-steps__label">
                  {step.label}
                  {/* The marker is decorative, so completion is stated in text. */}
                  <Show when={stateOf(i()) === "complete"}>
                    <VisuallyHidden>{` (${local.completedLabel ?? "completed"})`}</VisuallyHidden>
                  </Show>
                </span>
                <Show when={step.description}>
                  <span class="so-steps__description">{step.description}</span>
                </Show>
              </span>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}
