import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { useRadioGroup } from "./RadioGroupContext";

/** Native input attributes minus the ones this component owns. */
type RadioAttributes = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "value" | "checked" | "onChange" | "type" | "size" | "class" | "children"
>;

export interface RadioButtonProps extends CommonProps, RadioAttributes {
  value: string;
  label?: string;
  disabled?: boolean;
  children?: JSX.Element;
}

export function RadioButton(props: RadioButtonProps) {
  const [local, others] = splitProps(props, ["class", "value", "label", "disabled", "children"]);

  const group = useRadioGroup();

  const isChecked = () => group?.value() === local.value;

  const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = () => {
    group?.onChange(local.value);
  };

  return (
    <label class={cls("so-radio-button", local.disabled && "so-radio-button--disabled", local.class)}>
      <input
        {...others}
        type="radio"
        class="so-radio-button__input"
        // The group owns the name so the browser treats the buttons as one set.
        name={group?.name ?? others.name}
        value={local.value}
        checked={isChecked()}
        disabled={local.disabled}
        onChange={handleChange}
      />
      <span class="so-radio-button__indicator" aria-hidden="true">
        <span class="so-radio-button__dot" />
      </span>
      <Show when={local.label || local.children}>
        <span class="so-radio-button__label">{local.children ?? local.label}</span>
      </Show>
    </label>
  );
}
