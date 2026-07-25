import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

/** Native textarea attributes minus the ones this component owns. */
type TextAreaAttributes = Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onInput" | "class">;

export interface TextAreaInputProps extends InteractiveProps, TextAreaAttributes {
  value?: string;
  onInput?: (value: string) => void;
}

export interface TextAreaProps extends TextAreaInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function TextAreaInput(props: TextAreaInputProps) {
  const [local, others] = splitProps(props, ["value", "onInput", "rows", "size", "class", "density", "id"]);

  const ctx = useFormField();

  const handleInput: JSX.InputEventHandlerUnion<HTMLTextAreaElement, InputEvent> = (e) => {
    local.onInput?.(e.currentTarget.value);
  };

  return (
    <textarea
      {...others}
      id={ctx?.id ?? local.id}
      class={cls("so-textarea__input", `so-textarea__input--${local.size ?? "md"}`, local.class)}
      value={local.value ?? ""}
      rows={local.rows ?? 3}
      aria-invalid={ctx?.hasError || undefined}
      aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
      onInput={handleInput}
    />
  );
}

export function TextArea(props: TextAreaProps) {
  const [field, input] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={<TextAreaInput {...input} required={field.required} class={field.class} density={field.density} />}
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
          <TextAreaInput {...input} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
