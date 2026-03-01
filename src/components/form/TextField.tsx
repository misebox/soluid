import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "../../core/types";
import { cls } from "../../core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";
import "./TextField.css";

export interface TextFieldProps extends InteractiveProps {
  value?: string;
  onInput?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "url" | "tel";
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function TextFieldInput(props: {
  value?: string;
  onInput?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "url" | "tel";
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [local] = splitProps(props, [
    "value",
    "onInput",
    "placeholder",
    "type",
    "disabled",
    "required",
    "size",
  ]);

  const ctx = useFormField();

  const handleInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
    local.onInput?.(e.currentTarget.value);
  };

  return (
    <input
      id={ctx?.id}
      class={cls(
        "so-text-field__input",
        `so-text-field__input--${local.size ?? "md"}`,
      )}
      type={local.type ?? "text"}
      value={local.value ?? ""}
      placeholder={local.placeholder}
      disabled={local.disabled}
      required={local.required}
      aria-invalid={ctx?.hasError || undefined}
      aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
      onInput={handleInput}
    />
  );
}

export function TextField(props: TextFieldProps) {
  const [local, fieldProps] = splitProps(props, [
    "value",
    "onInput",
    "placeholder",
    "type",
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
      <TextFieldInput
        value={local.value}
        onInput={local.onInput}
        placeholder={local.placeholder}
        type={local.type}
        disabled={local.disabled}
        required={props.required}
        size={local.size}
      />
    </FormField>
  );
}
