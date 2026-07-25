import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

/** Native input attributes minus the ones this component owns. */
type NumberAttributes = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onInput" | "onBlur" | "type" | "size" | "class" | "min" | "max" | "step"
>;

interface NumberControlProps extends InteractiveProps, NumberAttributes {
  value?: number;
  onInput?: (value: number) => void;
  /** Runs after the typed value has been clamped into [min, max]. */
  onBlur?: (event: FocusEvent) => void;
  min?: number;
  max?: number;
  step?: number;
  decrementLabel?: string;
  incrementLabel?: string;
}

export interface NumberInputProps extends NumberControlProps {
  label: string;
  error?: string;
  hint?: string;
}

function NumberControl(props: NumberControlProps) {
  const [local, others] = splitProps(props, [
    "value",
    "onInput",
    "min",
    "max",
    "step",
    "size",
    "class",
    "density",
    "id",
    "disabled",
    "onBlur",
    "decrementLabel",
    "incrementLabel",
  ]);

  const ctx = useFormField();

  const stepValue = () => local.step ?? 1;

  function clamp(val: number): number {
    let result = val;
    if (local.min != null && result < local.min) result = local.min;
    if (local.max != null && result > local.max) result = local.max;
    return result;
  }

  function nudge(direction: 1 | -1): void {
    local.onInput?.(clamp((local.value ?? 0) + direction * stepValue()));
  }

  // Pass the raw parsed value through while typing. Clamping mid-input
  // prevents users from typing values that pass through min on the way
  // (e.g. typing "100" with min=64 would get stuck at 64 after the "1").
  const handleInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
    const parsed = parseFloat(e.currentTarget.value);
    if (!Number.isNaN(parsed)) {
      local.onInput?.(parsed);
    }
  };

  const handleBlur: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
    const parsed = parseFloat(e.currentTarget.value);
    if (!Number.isNaN(parsed)) {
      const clamped = clamp(parsed);
      if (clamped !== parsed) local.onInput?.(clamped);
    }
    local.onBlur?.(e);
  };

  return (
    <div class={cls("so-number-input", `so-number-input--${local.size ?? "md"}`, local.class)}>
      <button
        type="button"
        class="so-number-input__button so-number-input__button--decrement"
        disabled={local.disabled}
        tabIndex={-1}
        aria-label={local.decrementLabel ?? "Decrement"}
        onClick={() => nudge(-1)}
      >
        -
      </button>
      <input
        {...others}
        id={ctx?.id ?? local.id}
        class="so-number-input__input"
        type="number"
        value={local.value ?? ""}
        min={local.min}
        max={local.max}
        step={local.step}
        disabled={local.disabled}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onInput={handleInput}
        onBlur={handleBlur}
      />
      <button
        type="button"
        class="so-number-input__button so-number-input__button--increment"
        disabled={local.disabled}
        tabIndex={-1}
        aria-label={local.incrementLabel ?? "Increment"}
        onClick={() => nudge(1)}
      >
        +
      </button>
    </div>
  );
}

export function NumberInput(props: NumberInputProps) {
  const [field, control] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <FormField
      label={field.label}
      error={field.error}
      hint={field.hint}
      required={field.required}
      class={field.class}
      density={field.density}
    >
      <NumberControl {...control} required={field.required} />
    </FormField>
  );
}
