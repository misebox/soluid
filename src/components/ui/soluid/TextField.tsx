import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

/** Native input attributes minus the ones this component owns. */
type InputAttributes = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value" | "onInput" | "type" | "size" | "class">;

export type TextFieldType = "text" | "email" | "password" | "url" | "tel" | "search" | "number" | "date";

export interface TextFieldInputProps extends InteractiveProps, InputAttributes {
  value?: string;
  onInput?: (value: string) => void;
  type?: TextFieldType;
}

export interface TextFieldProps extends TextFieldInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function TextFieldInput(props: TextFieldInputProps) {
  const [local, others] = splitProps(props, ["value", "onInput", "type", "size", "class", "density", "id"]);

  const ctx = useFormField();

  const handleInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
    local.onInput?.(e.currentTarget.value);
  };

  return (
    <input
      {...others}
      // Inside a FormField the id belongs to the field so <label for> matches;
      // standalone, the caller's id applies.
      id={ctx?.id ?? local.id}
      class={cls("so-text-field__input", `so-text-field__input--${local.size ?? "md"}`, local.class)}
      type={local.type ?? "text"}
      value={local.value ?? ""}
      data-density={local.density}
      aria-invalid={ctx?.hasError || undefined}
      aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
      onInput={handleInput}
    />
  );
}

export function TextField(props: TextFieldProps) {
  const [field, input] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={<TextFieldInput {...input} required={field.required} class={field.class} density={field.density} />}
    >
      {(label) => (
        <FormField
          label={label()}
          id={input.id}
          error={field.error}
          hint={field.hint}
          required={field.required}
          class={field.class}
          density={field.density}
        >
          <TextFieldInput {...input} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
