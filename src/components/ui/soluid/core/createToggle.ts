import { createSignal } from "solid-js";
import type { Accessor } from "solid-js";

export interface ToggleOptions {
  /** Initial pressed state (uncontrolled) */
  defaultPressed?: boolean;
  /** Controlled pressed state */
  pressed?: Accessor<boolean>;
  /** Called when pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
}

export interface ToggleReturn {
  pressed: Accessor<boolean>;
  toggle: () => void;
  setPressed: (value: boolean) => void;
  props: {
    "aria-pressed": Accessor<boolean>;
    onClick: () => void;
  };
}

export function createToggle(options: ToggleOptions = {}): ToggleReturn {
  const [internalPressed, setInternalPressed] = createSignal(
    options.defaultPressed ?? false,
  );

  const pressed: Accessor<boolean> = options.pressed ?? internalPressed;

  function setPressed(value: boolean): void {
    if (!options.pressed) {
      setInternalPressed(value);
    }
    options.onPressedChange?.(value);
  }

  function toggle(): void {
    setPressed(!pressed());
  }

  return {
    pressed,
    toggle,
    setPressed,
    props: {
      "aria-pressed": pressed,
      onClick: toggle,
    },
  };
}
