import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

export interface TextAreaProps extends CommonProps {
  value?: string;
  onInput?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function TextAreaInput(props: {
  value?: string;
  onInput?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
}) {
  const [local] = splitProps(props, [
    "value",
    "onInput",
    "placeholder",
    "rows",
    "disabled",
    "required",
  ]);

  const ctx = useFormField();

  const handleInput: JSX.InputEventHandlerUnion<HTMLTextAreaElement, InputEvent> = (e) => {
    local.onInput?.(e.currentTarget.value);
  };

  return (
    <textarea
      id={ctx?.id}
      class="so-textarea__input"
      value={local.value ?? ""}
      placeholder={local.placeholder}
      rows={local.rows ?? 3}
      disabled={local.disabled}
      required={local.required}
      aria-invalid={ctx?.hasError || undefined}
      aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
      onInput={handleInput}
    />
  );
}

export function TextArea(props: TextAreaProps) {
  const [local, fieldProps] = splitProps(props, [
    "value",
    "onInput",
    "placeholder",
    "rows",
    "disabled",
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
      <TextAreaInput
        value={local.value}
        onInput={local.onInput}
        placeholder={local.placeholder}
        rows={local.rows}
        disabled={local.disabled}
        required={props.required}
      />
    </FormField>
  );
}
