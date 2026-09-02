import { createMemo, For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Size } from "./core/types";
import { cls } from "./core/utils";

export interface RatingProps extends CommonProps {
  value: number;
  onChange?: (value: number) => void;
  /** Number of items (default: 5) */
  max?: number;
  /** Render as a static indicator with no controls */
  readOnly?: boolean;
  disabled?: boolean;
  size?: Size;
  /** Accessible label for the group */
  label?: string;
  /** Accessible label for each item (default: `{n} of {max}`) */
  itemLabel?: (value: number, max: number) => string;
}

function Star(props: { filled: boolean }) {
  return (
    <svg
      class="so-rating__icon"
      viewBox="0 0 24 24"
      fill={props.filled ? "currentColor" : "none"}
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3 6.1 20.4l1.2-6.5-4.8-4.6 6.6-.9z" />
    </svg>
  );
}

// onChange is omitted because RatingProps redefines it with a numeric value;
// onKeyDown because the arrow keys are the component's own.
export function Rating(props: RatingProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onKeyDown">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "value",
    "onChange",
    "max",
    "readOnly",
    "disabled",
    "size",
    "label",
    "itemLabel",
  ]);

  const max = () => local.max ?? 5;
  // A memo: every star reads `tabStop`, which would otherwise rebuild the list.
  const items = createMemo(() => Array.from({ length: max() }, (_, i) => i + 1));
  // Exactly one tab stop: the selected item, else the first, so the group stays
  // reachable when the value is 0, fractional or above max.
  const tabStop = createMemo(() => (items().includes(local.value) ? local.value : 1));
  const itemLabel = (value: number) => local.itemLabel?.(value, max()) ?? `${value} of ${max()}`;

  let root: HTMLDivElement | undefined;

  function select(value: number): void {
    if (local.disabled || local.readOnly) return;
    local.onChange?.(value);
    // Roving tabindex: the stop moves to the new value, so focus must too.
    root?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[Math.max(0, value - 1)]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (local.disabled || local.readOnly) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      select(Math.min(max(), local.value + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      select(Math.max(0, local.value - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      select(1);
    } else if (e.key === "End") {
      e.preventDefault();
      select(max());
    }
  }

  return (
    <div
      ref={root}
      class={cls("so-rating", `so-rating--${local.size ?? "md"}`, local.disabled && "so-rating--disabled", local.class)}
      // Read-only ratings are a single image, not a set of controls.
      role={local.readOnly ? "img" : "radiogroup"}
      aria-label={local.readOnly ? itemLabel(local.value) : local.label}
      data-density={local.density}
      onKeyDown={handleKeyDown}
      {...others}
    >
      <Show
        when={!local.readOnly}
        fallback={
          <For each={items()}>
            {(item) => (
              <span class={cls("so-rating__item", item <= local.value && "so-rating__item--filled")}>
                <Star filled={item <= local.value} />
              </span>
            )}
          </For>
        }
      >
        <For each={items()}>
          {(item) => (
            <button
              type="button"
              class={cls("so-rating__item", item <= local.value && "so-rating__item--filled")}
              role="radio"
              aria-checked={item === local.value}
              aria-label={itemLabel(item)}
              disabled={local.disabled}
              tabIndex={item === tabStop() ? 0 : -1}
              onClick={() => select(item)}
            >
              <Star filled={item <= local.value} />
            </button>
          )}
        </For>
      </Show>
    </div>
  );
}
