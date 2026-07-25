import { createMemo, createUniqueId, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { createToggle } from "./core/createToggle";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

/** Native button attributes minus the ones this component owns. */
type SwitchAttributes = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type" | "role" | "class" | "children"
>;

export interface SwitchProps extends CommonProps, SwitchAttributes {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
  error?: string;
  hint?: string;
  children?: JSX.Element;
}

export function Switch(props: SwitchProps) {
  const [local, others] = splitProps(props, [
    "class",
    "checked",
    "onChange",
    "disabled",
    "size",
    "label",
    "error",
    "hint",
    "children",
  ]);

  const id = createUniqueId();
  const errorId = `so-sw-error-${id}`;
  const hintId = `so-sw-hint-${id}`;

  const pressedAccessor = createMemo(() => local.checked ?? false);

  const toggle = createToggle({
    pressed: pressedAccessor,
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

  return (
    <div class={cls("so-switch-wrapper", local.error && "so-switch-wrapper--error")}>
      <label
        class={cls(
          "so-switch",
          `so-switch--${local.size ?? "md"}`,
          local.disabled && "so-switch--disabled",
          local.class,
        )}
      >
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
        <Show when={local.label || local.children}>
          <span class="so-switch__label">{local.children ?? local.label}</span>
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
