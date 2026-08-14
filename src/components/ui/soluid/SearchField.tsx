import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { TextFieldInput } from "./TextField";

/** Native input attributes minus the ones this component owns. */
type SearchAttributes = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onInput" | "onKeyDown" | "type" | "size" | "class"
>;

export interface SearchFieldProps extends InteractiveProps, SearchAttributes {
  value?: string;
  onInput?: (value: string) => void;
  /** Called when Enter is pressed */
  onSearch?: (value: string) => void;
  /** Called when the clear button is pressed; also fires onInput("") */
  onClear?: () => void;
  /** Accessible label for the clear button (default: "Clear search") */
  clearLabel?: string;
  label?: string;
  error?: string;
  hint?: string;
}

function SearchControl(props: SearchFieldProps) {
  const [local, others] = splitProps(props, ["value", "onInput", "onSearch", "onClear", "clearLabel", "class"]);

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Enter") local.onSearch?.(local.value ?? "");
  }

  function handleClear(): void {
    local.onClear?.();
    local.onInput?.("");
  }

  return (
    <div class={cls("so-search-field", local.class)}>
      <svg
        class="so-search-field__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5" />
      </svg>
      <TextFieldInput
        {...others}
        class="so-search-field__input"
        type="text"
        value={local.value}
        onInput={local.onInput}
        onKeyDown={handleKeyDown}
      />
      <Show when={local.value}>
        <button
          type="button"
          class="so-search-field__clear"
          aria-label={local.clearLabel ?? "Clear search"}
          onClick={handleClear}
        >
          &#x2715;
        </button>
      </Show>
    </div>
  );
}

export function SearchField(props: SearchFieldProps) {
  const [field, control] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={<SearchControl {...control} required={field.required} class={field.class} density={field.density} />}
    >
      {(label) => (
        <FormField
          label={label()}
          error={field.error}
          hint={field.hint}
          required={field.required}
          class={field.class}
          density={field.density}
        >
          <SearchControl {...control} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
