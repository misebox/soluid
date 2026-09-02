import { createUniqueId, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { CheckboxGroupContext } from "./CheckboxGroupContext";
import type { CheckboxGroupContextValue } from "./CheckboxGroupContext";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface CheckboxGroupProps extends CommonProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  error?: string;
  hint?: string;
  children: JSX.Element;
}

export function CheckboxGroup(props: CheckboxGroupProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "value",
    "onChange",
    "label",
    "error",
    "hint",
    "children",
  ]);

  const id = createUniqueId();
  const errorId = `so-cbg-error-${id}`;
  const hintId = `so-cbg-hint-${id}`;

  const describedBy = () => {
    if (local.error) return errorId;
    if (local.hint) return hintId;
    return undefined;
  };

  const context: CheckboxGroupContextValue = {
    value: () => local.value ?? [],
    onChange(itemValue: string, checked: boolean) {
      const current = local.value ?? [];
      const next = checked ? [...current, itemValue] : current.filter((v) => v !== itemValue);
      local.onChange?.(next);
    },
  };

  return (
    <CheckboxGroupContext.Provider value={context}>
      <fieldset
        class={cls("so-checkbox-group", local.error && "so-checkbox-group--error", local.class)}
        role="group"
        aria-invalid={local.error ? true : undefined}
        aria-describedby={describedBy()}
        data-density={local.density}
        {...others}
      >
        <Show when={local.label}>
          <legend class="so-checkbox-group__label">{local.label}</legend>
        </Show>
        <div class="so-checkbox-group__items">{local.children}</div>
        <Show when={local.error}>
          <p class="so-checkbox-group__error" id={errorId} role="alert">
            {local.error}
          </p>
        </Show>
        <Show when={!local.error && local.hint}>
          <p class="so-checkbox-group__hint" id={hintId}>
            {local.hint}
          </p>
        </Show>
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
}
