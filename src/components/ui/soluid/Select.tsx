import { For, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> extends InteractiveProps {
  value?: T;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function SelectInput<T extends string = string>(props: {
  value?: T;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [local] = splitProps(props, [
    "value",
    "onChange",
    "options",
    "placeholder",
    "disabled",
    "required",
    "size",
  ]);

  const ctx = useFormField();

  const handleChange: JSX.ChangeEventHandlerUnion<HTMLSelectElement, Event> = (e) => {
    local.onChange?.(e.currentTarget.value as T);
  };

  return (
    <div class="so-select__wrapper">
      <select
        id={ctx?.id}
        class={cls(
          "so-select__input",
          `so-select__input--${local.size ?? "md"}`,
        )}
        value={local.value ?? ""}
        disabled={local.disabled}
        required={local.required}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onChange={handleChange}
      >
        {local.placeholder && (
          <option value="" disabled>
            {local.placeholder}
          </option>
        )}
        <For each={local.options}>
          {(option) => (
            <option value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          )}
        </For>
      </select>
      <svg
        class="so-select__arrow"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 4.5L6 8l3.5-3.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}

export function Select<T extends string = string>(props: SelectProps<T>) {
  const [local] = splitProps(props, [
    "value",
    "onChange",
    "options",
    "placeholder",
    "disabled",
    "size",
    "class",
    "density",
  ]);

  const [formProps] = splitProps(props, [
    "label",
    "error",
    "hint",
    "required",
    "class",
    "density",
  ]);

  return (
    <FormField
      label={formProps.label}
      error={formProps.error}
      hint={formProps.hint}
      required={formProps.required}
      class={formProps.class}
      density={formProps.density}
    >
      <SelectInput
        value={local.value}
        onChange={local.onChange}
        options={local.options}
        placeholder={local.placeholder}
        disabled={local.disabled}
        required={props.required}
        size={local.size}
      />
    </FormField>
  );
}
