import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import { createEffect, createMemo, createSignal, createUniqueId, For, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { claimEscape, isInsideNewerLayer, takeEscape } from "./core/createFocusTrap";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

/** Native button attributes minus the ones this component owns. */
type TriggerAttributes = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick" | "onKeyDown" | "type" | "class" | "size" | "value"
>;

/** Times are `HH:MM` on a 24-hour clock, matching `<input type="time">`. */
export interface TimePickerControlProps extends InteractiveProps, TriggerAttributes {
  value?: string;
  /** Submitted through a visually hidden text input, since the trigger is a button; `required` applies to it */
  name?: string;
  onChange?: (value: string) => void;
  /** Minutes between offered times (default: 30) */
  step?: number;
  /** Earliest and latest offered time, inclusive */
  min?: string;
  max?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  /** Formats an option for display; defaults to the raw `HH:MM` */
  format?: (value: string) => string;
  /** Accessible label for the list of times */
  listLabel?: string;
}

export interface TimePickerProps extends TimePickerControlProps {
  label?: string;
  error?: string;
  hint?: string;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function TimePickerControl(props: TimePickerControlProps) {
  const [local, others] = splitProps(props, [
    "value",
    "onChange",
    "step",
    "min",
    "max",
    "placeholder",
    "size",
    "class",
    "density",
    "id",
    "disabled",
    "required",
    "name",
    "format",
    "listLabel",
  ]);

  const ctx = useFormField();
  const baseId = createUniqueId();
  const listId = `so-time-picker-list-${baseId}`;
  const optionId = (index: number) => `so-time-picker-option-${baseId}-${index}`;

  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);

  let triggerRef: HTMLButtonElement | undefined;
  const [listRef, setListRef] = createSignal<HTMLUListElement | undefined>(undefined);

  const options = createMemo(() => {
    const step = Math.max(1, local.step ?? 30);
    const from = toMinutes(local.min ?? "00:00");
    const to = toMinutes(local.max ?? "23:59");
    const times: string[] = [];
    for (let minutes = from; minutes <= to; minutes += step) times.push(toTime(minutes));
    return times;
  });

  const display = () => (local.value ? (local.format?.(local.value) ?? local.value) : "");

  // step/min/max can change while the list is open; keep the highlight on a row that exists.
  createEffect(() => {
    if (active() >= options().length) setActive(Math.max(0, options().length - 1));
  });

  // Disabled while the list is open: drop it, or it keeps taking picks.
  createEffect(() => {
    if (local.disabled) setOpen(false);
  });

  function openList(): void {
    if (local.disabled) return;
    const index = options().indexOf(local.value ?? "");
    setActive(index >= 0 ? index : 0);
    setOpen(true);
  }

  function close(): void {
    setOpen(false);
    triggerRef?.focus();
  }

  function commit(index: number): void {
    const time = options()[index];
    if (!time) return;
    local.onChange?.(time);
    close();
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (!open()) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options().length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options().length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(active());
    } else if (e.key === "Escape") {
      if (takeEscape(listId, e)) close();
    } else if (e.key === "Tab") {
      // Focus is leaving; drop the list without pulling focus back.
      setOpen(false);
    }
  }

  function updatePosition(): void {
    const list = listRef();
    if (!triggerRef || !list) return;
    computePosition(triggerRef, list, {
      placement: "bottom-start",
      middleware: [
        offset(4),
        flip(),
        shift({ padding: 8 }),
        size({
          apply({ rects, elements, availableHeight }) {
            elements.floating.style.width = `${rects.reference.width}px`;
            // A soft keyboard leaves little room; the list shrinks to what is left.
            elements.floating.style.maxHeight = `${Math.min(224, availableHeight)}px`;
          },
        }),
      ],
    }).then(({ x, y }) => {
      list.style.left = `${x}px`;
      list.style.top = `${y}px`;
      // Until this runs the list sits at the document origin, so the CSS keeps
      // it hidden and nothing can focus or measure it there.
      list.dataset.soPlaced = "";
    });
  }

  createEffect(() => {
    const list = listRef();
    if (!open() || !triggerRef || !list) return;
    onCleanup(autoUpdate(triggerRef, list, updatePosition));
  });

  // Keep the highlighted time in view as the arrow keys walk the list. Scrolls
  // the list itself rather than calling scrollIntoView, which also scrolls the
  // page while floating-ui has yet to position the list.
  createEffect(() => {
    if (!open()) return;
    const index = active();
    queueMicrotask(() => {
      const list = listRef();
      const option = document.getElementById(optionId(index));
      if (!list || !option) return;
      const top = option.offsetTop;
      const bottom = top + option.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    });
  });

  function handleClickOutside(e: MouseEvent): void {
    const target = e.target as Node;
    if (triggerRef?.contains(target)) return;
    if (listRef()?.contains(target)) return;
    if (isInsideNewerLayer(listId, e)) return;
    setOpen(false);
  }

  createEffect(() => {
    if (!open()) return;
    document.addEventListener("pointerdown", handleClickOutside);
    onCleanup(claimEscape(listId, listRef()));
    onCleanup(() => document.removeEventListener("pointerdown", handleClickOutside));
  });

  return (
    <div
      class={cls("so-time-picker", `so-time-picker--${local.size ?? "md"}`, local.class)}
      data-density={local.density}
    >
      {/* The trigger is a button, so the form needs its own field to submit; a
          text input rather than hidden so `required` takes part in validation. */}
      <Show when={local.name}>
        {(name) => (
          <input
            class="so-visually-hidden"
            type="text"
            tabIndex={-1}
            aria-hidden="true"
            name={name()}
            value={local.value ?? ""}
            required={local.required}
            disabled={local.disabled}
            onInput={(e) => (e.currentTarget.value = local.value ?? "")}
          />
        )}
      </Show>
      <button
        {...others}
        ref={triggerRef}
        type="button"
        id={ctx?.id ?? local.id}
        class="so-time-picker__trigger"
        // aria-activedescendant is only valid on a combobox, not a plain button.
        role="combobox"
        disabled={local.disabled}
        aria-required={local.required || undefined}
        aria-haspopup="listbox"
        aria-expanded={open()}
        aria-controls={open() ? listId : undefined}
        aria-activedescendant={open() ? optionId(active()) : undefined}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onClick={() => (open() ? close() : openList())}
        onKeyDown={handleKeyDown}
      >
        <Show when={display()} fallback={<span class="so-time-picker__placeholder">{local.placeholder}</span>}>
          {(text) => <span class="so-time-picker__value">{text()}</span>}
        </Show>
        <svg
          class="so-time-picker__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </button>

      <Show when={open()}>
        <Portal>
          <ul
            ref={setListRef}
            id={listId}
            class="so-time-picker__list"
            data-density={local.density}
            role="listbox"
            aria-label={local.listLabel}
          >
            <For each={options()}>
              {(time, i) => (
                <li
                  id={optionId(i())}
                  class={cls("so-time-picker__option", i() === active() && "so-time-picker__option--active")}
                  role="option"
                  aria-selected={time === local.value}
                  // mousedown is prevented so the trigger keeps focus; the pick
                  // itself waits for click, so a touch scroll does not commit.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(i())}
                  onMouseEnter={() => setActive(i())}
                >
                  {local.format?.(time) ?? time}
                </li>
              )}
            </For>
          </ul>
        </Portal>
      </Show>
    </div>
  );
}

export function TimePicker(props: TimePickerProps) {
  const [field, control] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={
        <TimePickerControl {...control} required={field.required} class={field.class} density={field.density} />
      }
    >
      {(label) => (
        <FormField
          label={label()}
          id={control.id}
          error={field.error}
          hint={field.hint}
          required={field.required}
          class={field.class}
          density={field.density}
        >
          <TimePickerControl {...control} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
