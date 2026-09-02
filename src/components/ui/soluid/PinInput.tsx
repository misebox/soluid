import { Index, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

const PATTERNS = {
  numeric: /^[0-9]$/,
  alphanumeric: /^[a-zA-Z0-9]$/,
} as const;

export type PinInputType = "numeric" | "alphanumeric";

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
  type?: PinInputType;
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

  const length = () => {
    const requested = local.length ?? 6;
    // Array.from throws on Infinity and on lengths past 2^32-1.
    return Number.isFinite(requested) ? Math.max(0, Math.min(64, Math.trunc(requested))) : 6;
  };
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
    // Nothing accepted: leave the value alone so onChange and onComplete stay quiet.
    if (cursor === from) return;
    commit(next);
    focusBox(Math.min(cursor, length() - 1));
  }

  function clearBox(index: number): void {
    const next = chars();
    next[index] = "";
    commit(next);
  }

  const handleInput =
    (index: number): JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> =>
    (e) => {
      const current = chars()[index];
      const raw = e.currentTarget.value;
      e.currentTarget.value = current;
      if (raw === "") {
        clearBox(index);
        return;
      }
      // Typing over a filled box can arrive as "<old><new>"; an autofilled
      // code arrives whole and is spread across the boxes like a paste.
      const incoming = current !== "" && raw.startsWith(current) ? raw.slice(current.length) : raw;
      setChars(index, incoming.split(""));
    };

  function handleKeyDown(index: number, e: KeyboardEvent): void {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = chars();
      if (next[index] !== "") {
        clearBox(index);
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
      {/* Keyed by position: a box must survive its own character changing,
          or Backspace would dispose the focused input. */}
      <Index each={chars()}>
        {(char, i) => (
          <input
            ref={(el) => boxes.set(i, el)}
            class="so-pin-input__box"
            type={local.mask ? "password" : "text"}
            inputMode={local.type === "alphanumeric" ? "text" : "numeric"}
            autocomplete="one-time-code"
            maxLength={1}
            value={char()}
            disabled={local.disabled}
            aria-label={itemLabel(i)}
            onInput={handleInput(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={(e) => e.currentTarget.select()}
            // Safari collapses the focus-time selection on mouseup, after which
            // maxLength blocks typing over a filled box.
            onMouseUp={(e) => e.preventDefault()}
          />
        )}
      </Index>
    </div>
  );
}
