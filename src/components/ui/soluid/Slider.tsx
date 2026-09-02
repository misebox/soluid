import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "./core/types";
import { cls, mergeStyle } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

/** Native range attributes minus the ones this component owns. */
type RangeAttributes = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onInput" | "type" | "size" | "class" | "min" | "max" | "step"
>;

export interface SliderInputProps extends InteractiveProps, RangeAttributes {
  value?: number;
  onInput?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Show the current value next to the track */
  showValue?: boolean;
  /** Formats the value for display and for aria-valuetext */
  formatValue?: (value: number) => string;
}

export interface SliderProps extends SliderInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function SliderInput(props: SliderInputProps) {
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
    "showValue",
    "formatValue",
    "style",
  ]);

  const ctx = useFormField();

  // parseFloat("") is a normal way to end up with NaN here, and NaN would reach
  // the DOM as min="NaN" and a NaN% track.
  const finite = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback);
  const min = () => finite(local.min ?? 0, 0);
  const max = () => finite(local.max ?? 100, 100);
  const current = () => finite(local.value ?? min(), min());
  const display = () => local.formatValue?.(current()) ?? String(current());

  /** Position of the filled portion, used to paint the track. */
  const progress = () => {
    const span = max() - min();
    return span === 0 ? 0 : ((current() - min()) / span) * 100;
  };

  const handleInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
    const input = e.currentTarget;
    local.onInput?.(input.valueAsNumber);
    // Updates made in an event handler are batched, so the model has only
    // settled a microtask later. A parent that keeps the old value would
    // otherwise leave the thumb where the drag ended while the filled track
    // and the readout still show the value it kept.
    queueMicrotask(() => {
      // Uncontrolled: there is no model to disagree with.
      if (local.value == null) return;
      const settled = String(current());
      if (input.value !== settled) input.value = settled;
    });
  };

  return (
    <div class={cls("so-slider", `so-slider--${local.size ?? "md"}`, local.class)} data-density={local.density}>
      {/* A range input clamps and snaps `value` against the bounds it has when the
          value lands, so `min`, `max` and `step` must be set before it. */}
      <input
        {...others}
        id={ctx?.id ?? local.id}
        class="so-slider__input"
        type="range"
        min={min()}
        max={max()}
        step={local.step}
        value={current()}
        style={mergeStyle({ "--so-slider-progress": `${progress()}%` }, local.style)}
        aria-valuetext={local.formatValue ? display() : undefined}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onInput={handleInput}
      />
      <Show when={local.showValue}>
        <output class="so-slider__value">{display()}</output>
      </Show>
    </div>
  );
}

export function Slider(props: SliderProps) {
  const [field, input] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={<SliderInput {...input} required={field.required} class={field.class} density={field.density} />}
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
          <SliderInput {...input} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
