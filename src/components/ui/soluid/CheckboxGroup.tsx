import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { CheckboxGroupContext } from "./CheckboxGroupContext";
import type { CheckboxGroupContextValue } from "./CheckboxGroupContext";

export interface CheckboxGroupProps extends CommonProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  children: JSX.Element;
}

export function CheckboxGroup(props: CheckboxGroupProps) {
  const [local, others] = splitProps(props, [
    "class",
    "value",
    "onChange",
    "label",
    "children",
  ]);

  const context: CheckboxGroupContextValue = {
    value: () => local.value ?? [],
    onChange(itemValue: string, checked: boolean) {
      const current = local.value ?? [];
      const next = checked
        ? [...current, itemValue]
        : current.filter((v) => v !== itemValue);
      local.onChange?.(next);
    },
  };

  return (
    <CheckboxGroupContext.Provider value={context}>
      <fieldset
        class={cls("so-checkbox-group", local.class)}
        role="group"
        {...others}
      >
        <Show when={local.label}>
          <legend class="so-checkbox-group__label">{local.label}</legend>
        </Show>
        <div class="so-checkbox-group__items">{local.children}</div>
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
}
