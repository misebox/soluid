import { createEffect, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import { useCheckboxGroup } from "./CheckboxGroupContext";
import "./Checkbox.css";

export interface CheckboxProps extends CommonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
  value?: string;
  children?: JSX.Element;
}

export function Checkbox(props: CheckboxProps) {
  const [local, others] = splitProps(props, [
    "class",
    "checked",
    "onChange",
    "indeterminate",
    "disabled",
    "size",
    "label",
    "value",
    "children",
  ]);

  let inputRef: HTMLInputElement | undefined;

  const group = useCheckboxGroup();

  const isChecked = () => {
    if (group && local.value != null) {
      return group.value().includes(local.value);
    }
    return local.checked ?? false;
  };

  const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = () => {
    const next = !isChecked();
    if (group && local.value != null) {
      group.onChange(local.value, next);
    }
    local.onChange?.(next);
  };

  createEffect(() => {
    if (inputRef) {
      inputRef.indeterminate = local.indeterminate ?? false;
    }
  });

  return (
    <label
      class={cls(
        "so-checkbox",
        `so-checkbox--${local.size ?? "md"}`,
        local.disabled && "so-checkbox--disabled",
        local.class,
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        class="so-checkbox__input"
        checked={isChecked()}
        disabled={local.disabled}
        onChange={handleChange}
      />
      <span class="so-checkbox__indicator" aria-hidden="true">
        <Show when={local.indeterminate}>
          <svg viewBox="0 0 12 12" fill="none" class="so-checkbox__icon">
            <line
              x1="2"
              y1="6"
              x2="10"
              y2="6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </Show>
        <Show when={!local.indeterminate && isChecked()}>
          <svg viewBox="0 0 12 12" fill="none" class="so-checkbox__icon">
            <polyline
              points="2,6 5,9 10,3"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </Show>
      </span>
      <Show when={local.label || local.children}>
        <span class="so-checkbox__label">
          {local.children ?? local.label}
        </span>
      </Show>
    </label>
  );
}
