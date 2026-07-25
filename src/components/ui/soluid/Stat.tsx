import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface StatProps extends CommonProps {
  label: string;
  value: JSX.Element;
  /** Secondary text under the value */
  hint?: string;
  /** Change indicator, e.g. "+12.5%" */
  delta?: string;
  /** Colour of the change indicator (default: "neutral") */
  deltaTone?: "positive" | "negative" | "neutral";
  icon?: JSX.Element;
}

export function Stat(props: StatProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "label",
    "value",
    "hint",
    "delta",
    "deltaTone",
    "icon",
  ]);

  return (
    <div class={cls("so-stat", local.class)} data-density={local.density} {...others}>
      <Show when={local.icon}>
        <div class="so-stat__icon" aria-hidden="true">
          {local.icon}
        </div>
      </Show>
      <div class="so-stat__body">
        <dl class="so-stat__pair">
          <dt class="so-stat__label">{local.label}</dt>
          <dd class="so-stat__value">{local.value}</dd>
        </dl>
        <Show when={local.delta}>
          {(delta) => (
            <span class={cls("so-stat__delta", `so-stat__delta--${local.deltaTone ?? "neutral"}`)}>{delta()}</span>
          )}
        </Show>
        <Show when={local.hint}>
          <p class="so-stat__hint">{local.hint}</p>
        </Show>
      </div>
    </div>
  );
}
