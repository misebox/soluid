import { For, splitProps } from "solid-js";
import type { CommonProps, SmallSize } from "./core/types";
import { cls } from "./core/utils";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> extends CommonProps {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
  size?: SmallSize;
  /** Accessible label describing what is being chosen */
  label?: string;
  /** Stretch the segments to fill the available width */
  fullWidth?: boolean;
}

/**
 * Exclusive choice between a small set of options, rendered as a radio group
 * so arrow keys move the selection the way assistive tech expects.
 */
export function SegmentedControl<T extends string = string>(props: SegmentedControlProps<T>) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "value",
    "onChange",
    "options",
    "size",
    "label",
    "fullWidth",
  ]);

  const selectable = () => local.options.filter((option) => !option.disabled);

  function moveSelection(offset: number): void {
    const options = selectable();
    if (options.length === 0) return;
    const current = options.findIndex((option) => option.value === local.value);
    const next = (current + offset + options.length) % options.length;
    local.onChange(options[next].value);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      moveSelection(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      moveSelection(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = selectable()[0];
      if (first) local.onChange(first.value);
    } else if (e.key === "End") {
      e.preventDefault();
      const options = selectable();
      const last = options[options.length - 1];
      if (last) local.onChange(last.value);
    }
  }

  return (
    <div
      class={cls(
        "so-segmented",
        `so-segmented--${local.size ?? "md"}`,
        local.fullWidth && "so-segmented--full",
        local.class,
      )}
      role="radiogroup"
      aria-label={local.label}
      data-density={local.density}
      onKeyDown={handleKeyDown}
      {...others}
    >
      <For each={local.options}>
        {(option) => (
          <button
            type="button"
            class={cls("so-segmented__item", local.value === option.value && "so-segmented__item--active")}
            role="radio"
            aria-checked={local.value === option.value}
            disabled={option.disabled}
            // Only the selected segment is a tab stop; arrow keys move within.
            tabIndex={local.value === option.value ? 0 : -1}
            onClick={() => local.onChange(option.value)}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
}
