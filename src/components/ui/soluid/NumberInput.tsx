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

/**
 * Decimal places to round a stepped value to. Undefined when a value is
 * written in exponential form, where the count would be misleading.
 */
function precisionOf(...values: number[]): number | undefined {
  let places = 0;
  for (const value of values) {
    const text = String(value);
    if (text.includes("e")) return undefined;
    const dot = text.indexOf(".");
    places = Math.max(places, dot === -1 ? 0 : text.length - dot - 1);
  }
  return places;
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
    "readOnly",
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
    const current = local.value ?? 0;
    const next = current + direction * stepValue();
    // A step like 0.1 has no exact binary form, so repeated nudges drift
    // (0.2 + 0.1 = 0.30000000000000004). Rounding back to the decimals the
    // step and the value carry keeps the number the one on screen.
    const places = precisionOf(stepValue(), current);
    local.onInput?.(clamp(places === undefined ? next : Number(next.toFixed(places))));
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
    // The box may be empty or hold a value the parent rejected; repaint from
    // the model so what is shown is what is stored.
    e.currentTarget.value = local.value == null ? "" : String(local.value);
    local.onBlur?.(e);
  };

  return (
    <div
      class={cls("so-number-input", `so-number-input--${local.size ?? "md"}`, local.class)}
      data-density={local.density}
    >
      <button
        type="button"
        class="so-number-input__button so-number-input__button--decrement"
        disabled={local.disabled || local.readOnly}
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
        readOnly={local.readOnly}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onInput={handleInput}
        onBlur={handleBlur}
      />
      <button
        type="button"
        class="so-number-input__button so-number-input__button--increment"
        disabled={local.disabled || local.readOnly}
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
