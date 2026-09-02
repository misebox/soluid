import { For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

/** Native select attributes minus the ones this component owns. */
type SelectAttributes = Omit<
  JSX.SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange" | "size" | "class" | "children"
>;

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps<T extends string = string> extends InteractiveProps, SelectAttributes {
  value?: T;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
}

export interface SelectProps<T extends string = string> extends SelectInputProps<T> {
  label?: string;
  error?: string;
  hint?: string;
}

export function SelectInput<T extends string = string>(props: SelectInputProps<T>) {
  const [local, others] = splitProps(props, [
    "value",
    "onChange",
    "options",
    "placeholder",
    "size",
    "class",
    "density",
    "id",
  ]);

  const ctx = useFormField();

  const handleChange: JSX.ChangeEventHandlerUnion<HTMLSelectElement, Event> = (e) => {
    local.onChange?.(e.currentTarget.value as T);
  };

  return (
    <div class={cls("so-select__wrapper", local.class)}>
      <select
        {...others}
        id={ctx?.id ?? local.id}
        class={cls("so-select__input", `so-select__input--${local.size ?? "md"}`)}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onChange={handleChange}
      >
        {/* `value` on <select> is applied before the options exist, so the browser
            falls back to the first option; selecting per option also survives
            the option list being replaced. */}
        <Show when={local.placeholder}>
          {(placeholder) => (
            <option value="" disabled selected={!local.value}>
              {placeholder()}
            </option>
          )}
        </Show>
        <For each={local.options}>
          {(option) => (
            <option value={option.value} disabled={option.disabled} selected={option.value === local.value}>
              {option.label}
            </option>
          )}
        </For>
      </select>
      <svg
        class="so-select__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m5 9 7 7 7-7" />
      </svg>
    </div>
  );
}

export function Select<T extends string = string>(props: SelectProps<T>) {
  const [field, input] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={<SelectInput {...input} required={field.required} class={field.class} density={field.density} />}
    >
      {(label) => (
        <FormField
          label={label()}
          error={field.error}
          hint={field.hint}
          required={field.required}
          class={field.class}
          density={field.density}
        >
          <SelectInput {...input} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
