import { createUniqueId, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { RadioGroupContext } from "./RadioGroupContext";
import type { RadioGroupContextValue } from "./RadioGroupContext";

export interface RadioGroupProps extends CommonProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  children: JSX.Element;
}

export function RadioGroup(props: RadioGroupProps) {
  const [local, others] = splitProps(props, [
    "class",
    "value",
    "onChange",
    "name",
    "label",
    "children",
  ]);

  const generatedName = createUniqueId();

  const context: RadioGroupContextValue = {
    get name() {
      return local.name ?? `so-radio-${generatedName}`;
    },
    value: () => local.value,
    onChange(value: string) {
      local.onChange?.(value);
    },
  };

  return (
    <RadioGroupContext.Provider value={context}>
      <fieldset
        class={cls("so-radio-group", local.class)}
        role="radiogroup"
        {...others}
      >
        <Show when={local.label}>
          <legend class="so-radio-group__label">{local.label}</legend>
        </Show>
        <div class="so-radio-group__items">{local.children}</div>
      </fieldset>
    </RadioGroupContext.Provider>
  );
}
