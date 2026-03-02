import { createUniqueId, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { FormFieldContext } from "./FormFieldContext";
import type { FormFieldContextValue } from "./FormFieldContext";

export interface FormFieldProps extends CommonProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: JSX.Element;
}

export function FormField(props: FormFieldProps) {
  const [local, others] = splitProps(props, [
    "class",
    "label",
    "error",
    "hint",
    "required",
    "children",
  ]);

  const id = createUniqueId();
  const fieldId = `so-field-${id}`;
  const errorId = `so-field-error-${id}`;
  const hintId = `so-field-hint-${id}`;

  const context: FormFieldContextValue = {
    get id() {
      return fieldId;
    },
    get errorId() {
      return errorId;
    },
    get hintId() {
      return hintId;
    },
    get hasError() {
      return !!local.error;
    },
  };

  return (
    <FormFieldContext.Provider value={context}>
      <div
        class={cls(
          "so-form-field",
          local.error && "so-form-field--error",
          local.class,
        )}
        {...others}
      >
        <label class="so-form-field__label" for={fieldId}>
          {local.label}
          <Show when={local.required}>
            <span class="so-form-field__required" aria-hidden="true">
              *
            </span>
          </Show>
        </label>
        {local.children}
        <Show when={local.error}>
          <p class="so-form-field__error" id={errorId} role="alert">
            {local.error}
          </p>
        </Show>
        <Show when={!local.error && local.hint}>
          <p class="so-form-field__hint" id={hintId}>
            {local.hint}
          </p>
        </Show>
      </div>
    </FormFieldContext.Provider>
  );
}
