import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "../../core/types";
import { cls } from "../../core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";
import "./NumberInput.css";

export interface NumberInputProps extends InteractiveProps {
  value?: number;
  onInput?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function NumberInputInner(props: {
  value?: number;
  onInput?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [local] = splitProps(props, [
    "value",
    "onInput",
    "min",
    "max",
    "step",
    "disabled",
    "required",
    "size",
  ]);

  const ctx = useFormField();

  const stepValue = () => local.step ?? 1;

  function clamp(val: number): number {
    let result = val;
    if (local.min != null && result < local.min) result = local.min;
    if (local.max != null && result > local.max) result = local.max;
    return result;
  }

  function increment(): void {
    const current = local.value ?? 0;
    const next = clamp(current + stepValue());
    local.onInput?.(next);
  }

  function decrement(): void {
    const current = local.value ?? 0;
    const next = clamp(current - stepValue());
    local.onInput?.(next);
  }

  const handleInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
    const parsed = parseFloat(e.currentTarget.value);
    if (!Number.isNaN(parsed)) {
      local.onInput?.(clamp(parsed));
    }
  };

  return (
    <div
      class={cls(
        "so-number-input",
        `so-number-input--${local.size ?? "md"}`,
      )}
    >
      <button
        type="button"
        class="so-number-input__button so-number-input__button--decrement"
        disabled={local.disabled}
        tabIndex={-1}
        aria-label="Decrement"
        onClick={decrement}
      >
        -
      </button>
      <input
        id={ctx?.id}
        class="so-number-input__input"
        type="number"
        value={local.value ?? ""}
        min={local.min}
        max={local.max}
        step={local.step}
        disabled={local.disabled}
        required={local.required}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onInput={handleInput}
      />
      <button
        type="button"
        class="so-number-input__button so-number-input__button--increment"
        disabled={local.disabled}
        tabIndex={-1}
        aria-label="Increment"
        onClick={increment}
      >
        +
      </button>
    </div>
  );
}

export function NumberInput(props: NumberInputProps) {
  const [local] = splitProps(props, [
    "value",
    "onInput",
    "min",
    "max",
    "step",
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
      <NumberInputInner
        value={local.value}
        onInput={local.onInput}
        min={local.min}
        max={local.max}
        step={local.step}
        disabled={local.disabled}
        required={props.required}
        size={local.size}
      />
    </FormField>
  );
}
