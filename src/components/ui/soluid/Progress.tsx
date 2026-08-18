import { For, Show, splitProps } from "solid-js";
import type { CommonProps, FeedbackVariant, SmallSize } from "./core/types";
import { cls } from "./core/utils";

export interface ProgressSegment {
  value: number;
  variant?: FeedbackVariant;
}

export interface ProgressProps extends CommonProps {
  value?: number;
  variant?: FeedbackVariant;
  /**
   * Multi-segment mode. When provided, segments render side-by-side and
   * `value` / `variant` are ignored. Each segment's `value` is a percentage
   * 0-100; the sum may be less than 100 (the remainder shows the empty track).
   */
  segments?: ProgressSegment[];
  size?: SmallSize;
  /** Required: role="progressbar" is meaningless to a screen reader without a name. */
  "aria-label": string;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function Progress(props: ProgressProps) {
  const [local, others] = splitProps(props, ["class", "density", "value", "variant", "segments", "size", "aria-label"]);

  const isSegmented = () => Array.isArray(local.segments) && local.segments.length > 0;

  const singleValue = () => clamp(local.value ?? 0);

  const segmentTotal = () => {
    const segs = local.segments;
    if (!segs) return 0;
    let total = 0;
    for (const s of segs) total += clamp(s.value);
    return clamp(total);
  };

  return (
    <div
      class={cls(
        "so-progress",
        `so-progress--${local.size ?? "md"}`,
        isSegmented() ? "so-progress--multi" : `so-progress--${local.variant ?? "info"}`,
        local.class,
      )}
      role="progressbar"
      aria-valuenow={isSegmented() ? segmentTotal() : singleValue()}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={local["aria-label"]}
      data-density={local.density}
      {...others}
    >
      <Show when={isSegmented()} fallback={<div class="so-progress__bar" style={{ width: `${singleValue()}%` }} />}>
        <For each={local.segments}>
          {(seg) => (
            <div
              class={cls("so-progress__bar", `so-progress__bar--${seg.variant ?? "info"}`)}
              style={{ "flex-basis": `${clamp(seg.value)}%` }}
            />
          )}
        </For>
      </Show>
    </div>
  );
}
