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
  error?: string;
  hint?: string;
  children: JSX.Element;
}

export function RadioGroup(props: RadioGroupProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "value",
    "onChange",
    "name",
    "label",
    "error",
    "hint",
    "children",
  ]);

  const generatedName = createUniqueId();
  const id = createUniqueId();
  const errorId = `so-rg-error-${id}`;
  const hintId = `so-rg-hint-${id}`;

  const describedBy = () => {
    if (local.error) return errorId;
    if (local.hint) return hintId;
    return undefined;
  };

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
        class={cls("so-radio-group", local.error && "so-radio-group--error", local.class)}
        role="radiogroup"
        aria-invalid={local.error ? true : undefined}
        aria-describedby={describedBy()}
        data-density={local.density}
        {...others}
      >
        <Show when={local.label}>
          <legend class="so-radio-group__label">{local.label}</legend>
        </Show>
        <div class="so-radio-group__items">{local.children}</div>
        <Show when={local.error}>
          <p class="so-radio-group__error" id={errorId} role="alert">
            {local.error}
          </p>
        </Show>
        <Show when={!local.error && local.hint}>
          <p class="so-radio-group__hint" id={hintId}>
            {local.hint}
          </p>
        </Show>
      </fieldset>
    </RadioGroupContext.Provider>
  );
}
