import { createMemo, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import { createToggle } from "../../primitives/createToggle";
import "./Switch.css";

export interface SwitchProps extends CommonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
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
    "children",
  ]);

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

  return (
    <label
      class={cls(
        "so-switch",
        `so-switch--${local.size ?? "md"}`,
        local.disabled && "so-switch--disabled",
        local.class,
      )}
    >
      <button
        type="button"
        role="switch"
        class="so-switch__track"
        aria-checked={toggle.pressed()}
        disabled={local.disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <span class="so-switch__thumb" />
      </button>
      <Show when={local.label || local.children}>
        <span class="so-switch__label">
          {local.children ?? local.label}
        </span>
      </Show>
    </label>
  );
}
