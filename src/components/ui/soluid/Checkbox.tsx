import { createEffect, createUniqueId, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { useCheckboxGroup } from "./CheckboxGroupContext";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

/** Native input attributes minus the ones this component owns. */
type CheckboxAttributes = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "checked" | "onChange" | "value" | "type" | "size" | "class" | "children"
>;

export interface CheckboxProps extends CommonProps, CheckboxAttributes {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
  value?: string;
  error?: string;
  hint?: string;
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
    "error",
    "hint",
    "children",
  ]);

  let inputRef: HTMLInputElement | undefined;

  const group = useCheckboxGroup();

  const id = createUniqueId();
  const errorId = `so-cb-error-${id}`;
  const hintId = `so-cb-hint-${id}`;

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

  const describedBy = () => {
    if (local.error) return errorId;
    if (local.hint) return hintId;
    return undefined;
  };

  createEffect(() => {
    if (inputRef) {
      inputRef.indeterminate = local.indeterminate ?? false;
    }
  });

  return (
    <div class={cls("so-checkbox-wrapper", local.error && "so-checkbox-wrapper--error")}>
      <label
        class={cls(
          "so-checkbox",
          `so-checkbox--${local.size ?? "md"}`,
          local.disabled && "so-checkbox--disabled",
          local.class,
        )}
      >
        <input
          {...others}
          ref={inputRef}
          type="checkbox"
          class="so-checkbox__input"
          value={local.value}
          checked={isChecked()}
          disabled={local.disabled}
          onChange={handleChange}
          aria-invalid={local.error ? true : undefined}
          aria-describedby={describedBy()}
        />
        <span class="so-checkbox__indicator" aria-hidden="true">
          <Show when={local.indeterminate}>
            <svg
              class="so-checkbox__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 12h16" />
            </svg>
          </Show>
          <Show when={!local.indeterminate && isChecked()}>
            <svg
              class="so-checkbox__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m4 12 6 6 10-12" />
            </svg>
          </Show>
        </span>
        <Show when={local.label || local.children}>
          <span class="so-checkbox__label">{local.children ?? local.label}</span>
        </Show>
      </label>
      <Show when={local.error}>
        <p class="so-checkbox__error" id={errorId} role="alert">
          {local.error}
        </p>
      </Show>
      <Show when={!local.error && local.hint}>
        <p class="so-checkbox__hint" id={hintId}>
          {local.hint}
        </p>
      </Show>
    </div>
  );
}
