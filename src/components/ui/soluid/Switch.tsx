import { children, createUniqueId, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { createToggle } from "./core/createToggle";
import type { CommonProps, SmallSize } from "./core/types";
import { cls } from "./core/utils";

/** Native button attributes minus the ones this component owns. */
type SwitchAttributes = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick" | "onKeyDown" | "type" | "role" | "class" | "children"
>;

export interface SwitchProps extends CommonProps, SwitchAttributes {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: SmallSize;
  label?: string;
  error?: string;
  hint?: string;
  children?: JSX.Element;
}

export function Switch(props: SwitchProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "checked",
    "onChange",
    "disabled",
    "size",
    "label",
    "error",
    "hint",
    "children",
    "name",
    "value",
  ]);

  const id = createUniqueId();
  const errorId = `so-sw-error-${id}`;
  const hintId = `so-sw-hint-${id}`;

  const toggle = createToggle({
    pressed: () => local.checked,
    onPressedChange(pressed) {
      local.onChange?.(pressed);
    },
  });

  const handleClick = () => {
    if (!local.disabled) {
      toggle.toggle();
    }
  };

  const handleKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!local.disabled) {
        toggle.toggle();
      }
    }
  };

  const describedBy = () => {
    if (local.error) return errorId;
    if (local.hint) return hintId;
    return undefined;
  };

  // Resolved once: reading `local.children` twice would create it twice.
  const content = children(() => local.children);

  return (
    <div class={cls("so-switch-wrapper", local.error && "so-switch-wrapper--error")} data-density={local.density}>
      <label
        class={cls(
          "so-switch",
          `so-switch--${local.size ?? "md"}`,
          local.disabled && "so-switch--disabled",
          local.class,
        )}
      >
        {/* The track is a button, so the form needs a field of its own; like a
            checkbox it only submits while on. */}
        <Show when={local.name && toggle.pressed()}>
          <input type="hidden" name={local.name} value={local.value == null ? "on" : String(local.value)} />
        </Show>
        <button
          {...others}
          type="button"
          role="switch"
          class="so-switch__track"
          aria-checked={toggle.pressed()}
          aria-invalid={local.error ? true : undefined}
          aria-describedby={describedBy()}
          disabled={local.disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <span class="so-switch__thumb" />
        </button>
        <Show when={local.label || content()}>
          <span class="so-switch__label">{content() ?? local.label}</span>
        </Show>
      </label>
      <Show when={local.error}>
        <p class="so-switch__error" id={errorId} role="alert">
          {local.error}
        </p>
      </Show>
      <Show when={!local.error && local.hint}>
        <p class="so-switch__hint" id={hintId}>
          {local.hint}
        </p>
      </Show>
    </div>
  );
}
