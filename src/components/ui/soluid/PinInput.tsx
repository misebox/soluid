import { For, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

const PATTERNS = {
  numeric: /^[0-9]$/,
  alphanumeric: /^[a-zA-Z0-9]$/,
} as const;

export interface PinInputProps extends CommonProps {
  /**
   * One entry per box, empty string for a blank box. An array rather than a
   * string so clearing a middle box cannot shift the characters after it.
   */
  value: string[];
  onChange: (value: string[]) => void;
  /** Number of boxes (default: 6) */
  length?: number;
  /** Characters accepted (default: "numeric") */
  type?: "numeric" | "alphanumeric";
  /** Render entered characters as dots */
  mask?: boolean;
  disabled?: boolean;
  /** Accessible label for the group */
  label?: string;
  /** Accessible label for each box (default: `Character {n} of {length}`) */
  itemLabel?: (position: number, length: number) => string;
  /** Called with the joined value once every box is filled */
  onComplete?: (value: string) => void;
}

// onChange is omitted because PinInputProps redefines it with the box array.
export function PinInput(props: PinInputProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "value",
    "onChange",
    "length",
    "type",
    "mask",
    "disabled",
    "label",
    "itemLabel",
    "onComplete",
  ]);

  const boxes = new Map<number, HTMLInputElement>();

  const length = () => local.length ?? 6;
  const chars = () => Array.from({ length: length() }, (_, i) => local.value[i] ?? "");
  const itemLabel = (index: number) =>
    local.itemLabel?.(index + 1, length()) ?? `Character ${index + 1} of ${length()}`;

  const accepts = (char: string) => PATTERNS[local.type ?? "numeric"].test(char);

  function focusBox(index: number): void {
    boxes.get(index)?.focus();
    boxes.get(index)?.select();
  }

  function commit(next: string[]): void {
    local.onChange(next);
    if (next.length === length() && next.every((c) => c !== "")) {
      local.onComplete?.(next.join(""));
    }
  }

  function setChars(from: number, incoming: string[]): void {
    const next = chars();
    let cursor = from;
    for (const char of incoming) {
      if (cursor >= length()) break;
      if (!accepts(char)) continue;
      next[cursor] = char;
      cursor += 1;
    }
    commit(next);
    focusBox(Math.min(cursor, length() - 1));
  }

  const handleInput =
    (index: number): JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> =>
    (e) => {
      // A box already holding a character keeps the newly typed one, not both.
      const typed = e.currentTarget.value.slice(-1);
      e.currentTarget.value = chars()[index];
      if (typed !== "") setChars(index, [typed]);
    };

  function handleKeyDown(index: number, e: KeyboardEvent): void {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = chars();
      if (next[index] !== "") {
        next[index] = "";
        commit(next);
      } else if (index > 0) {
        next[index - 1] = "";
        commit(next);
        focusBox(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight" && index < length() - 1) {
      e.preventDefault();
      focusBox(index + 1);
    }
  }

  function handlePaste(index: number, e: ClipboardEvent): void {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") ?? "";
    setChars(index, text.split(""));
  }

  return (
    <div
      class={cls("so-pin-input", local.class)}
      role="group"
      aria-label={local.label}
      data-density={local.density}
      {...others}
    >
      <For each={chars()}>
        {(char, i) => (
          <input
            ref={(el) => boxes.set(i(), el)}
            class="so-pin-input__box"
            type={local.mask ? "password" : "text"}
            inputMode={local.type === "alphanumeric" ? "text" : "numeric"}
            autocomplete="one-time-code"
            maxLength={1}
            value={char}
            disabled={local.disabled}
            aria-label={itemLabel(i())}
            onInput={handleInput(i())}
            onKeyDown={(e) => handleKeyDown(i(), e)}
            onPaste={(e) => handlePaste(i(), e)}
            onFocus={(e) => e.currentTarget.select()}
          />
        )}
      </For>
    </div>
  );
}
