import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import { createEffect, createMemo, createSignal, createUniqueId, For, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { claimEscape, isInsideNewerLayer, takeEscape } from "./core/createFocusTrap";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";
import { VisuallyHidden } from "./VisuallyHidden";

export interface ComboboxOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/** Native input attributes minus the ones this component owns. */
type InputAttributes = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onInput" | "onClick" | "onKeyDown" | "type" | "class" | "size" | "role" | "autocomplete"
>;

export interface ComboboxControlProps<T extends string = string> extends InteractiveProps, InputAttributes {
  value?: T;
  /** Submitted through a hidden field: the visible input shows the label, not the value */
  name?: string;
  onChange?: (value: T) => void;
  options: ComboboxOption<T>[];
  placeholder?: string;
  required?: boolean;
  id?: string;
  /** Shown when the query matches nothing (default: "No results") */
  emptyLabel?: string;
  /** Overrides the default case-insensitive substring match */
  filter?: (option: ComboboxOption<T>, query: string) => boolean;
}

export interface ComboboxProps<T extends string = string> extends ComboboxControlProps<T> {
  label?: string;
  error?: string;
  hint?: string;
}

function defaultFilter<T extends string>(option: ComboboxOption<T>, query: string): boolean {
  return option.label.toLowerCase().includes(query.toLowerCase());
}

export function ComboboxControl<T extends string = string>(props: ComboboxControlProps<T>) {
  const [local, others] = splitProps(props, [
    "value",
    "name",
    "onChange",
    "options",
    "placeholder",
    "size",
    "class",
    "density",
    "id",
    "emptyLabel",
    "filter",
    "disabled",
  ]);

  const ctx = useFormField();
  const baseId = createUniqueId();
  const listId = `so-combobox-list-${baseId}`;
  const optionId = (index: number) => `so-combobox-option-${baseId}-${index}`;

  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal("");
  const [active, setActive] = createSignal(0);

  let inputRef: HTMLInputElement | undefined;
  const [listRef, setListRef] = createSignal<HTMLUListElement | undefined>(undefined);

  const selected = () => local.options.find((option) => option.value === local.value);

  /** While closed the input mirrors the selection; while open it is the query. */
  const inputValue = () => (open() ? query() : (selected()?.label ?? ""));

  const matches = createMemo(() => {
    const q = query();
    if (!open() || q === "") return local.options;
    const match = local.filter ?? defaultFilter;
    return local.options.filter((option) => match(option, q));
  });

  const enabled = () => matches().filter((option) => !option.disabled);
  const hasList = () => open() && matches().length > 0;
  const firstEnabled = () =>
    Math.max(
      0,
      matches().findIndex((option) => !option.disabled),
    );

  function openList(): void {
    if (local.disabled) return;
    setQuery("");
    setActive(firstEnabled());
    setOpen(true);
  }

  // Options can be replaced while the list is open (async loading); the
  // highlight must still land on a row that exists.
  createEffect(() => {
    if (matches().length > 0 && active() >= matches().length) setActive(firstEnabled());
  });

  // Disabled while the list is open: drop it, or it keeps taking picks.
  createEffect(() => {
    if (local.disabled) closeList();
  });

  function closeList(): void {
    setOpen(false);
    setQuery("");
  }

  function commit(option: ComboboxOption<T> | undefined): void {
    if (!option || option.disabled) return;
    local.onChange?.(option.value);
    closeList();
    inputRef?.focus();
  }

  function move(offsetBy: number): void {
    const list = matches();
    if (list.length === 0) return;
    let next = active();
    // Step over disabled options rather than landing on them.
    for (let i = 0; i < list.length; i++) {
      next = (next + offsetBy + list.length) % list.length;
      if (!list[next].disabled) break;
    }
    setActive(next);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    // The Enter that confirms an IME composition is not a pick.
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open()) openList();
      else move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (open()) move(-1);
    } else if (e.key === "Enter") {
      if (!open()) return;
      e.preventDefault();
      commit(matches()[active()]);
    } else if (e.key === "Escape") {
      if (!open() || !takeEscape(listId, e)) return;
      closeList();
    } else if (e.key === "Tab") {
      closeList();
    }
  }

  function updatePosition(): void {
    const list = listRef();
    if (!inputRef || !list) return;
    computePosition(inputRef, list, {
      placement: "bottom-start",
      middleware: [
        offset(4),
        flip(),
        shift({ padding: 8 }),
        // Match the trigger width so the list lines up with the field.
        size({
          apply({ rects, elements, availableHeight }) {
            elements.floating.style.width = `${rects.reference.width}px`;
            // A soft keyboard leaves little room; the list shrinks to what is left.
            elements.floating.style.maxHeight = `${Math.min(240, availableHeight)}px`;
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
    if (!open() || !inputRef || !list) return;
    onCleanup(autoUpdate(inputRef, list, updatePosition));
  });

  function handleClickOutside(e: MouseEvent): void {
    const target = e.target as Node;
    if (inputRef?.contains(target)) return;
    if (listRef()?.contains(target)) return;
    if (isInsideNewerLayer(listId, e)) return;
    closeList();
  }

  createEffect(() => {
    if (!open()) return;
    document.addEventListener("pointerdown", handleClickOutside);
    onCleanup(claimEscape(listId, listRef()));
    onCleanup(() => document.removeEventListener("pointerdown", handleClickOutside));
  });

  return (
    <div class={cls("so-combobox", `so-combobox--${local.size ?? "md"}`, local.class)} data-density={local.density}>
      {/* The visible input carries the label, so the form needs a field with the value. */}
      <Show when={local.name}>{(name) => <input type="hidden" name={name()} value={local.value ?? ""} />}</Show>
      <input
        {...others}
        ref={inputRef}
        id={ctx?.id ?? local.id}
        class="so-combobox__input"
        type="text"
        role="combobox"
        autocomplete="off"
        value={inputValue()}
        placeholder={local.placeholder}
        disabled={local.disabled}
        aria-expanded={hasList()}
        aria-controls={hasList() ? listId : undefined}
        aria-activedescendant={hasList() ? optionId(active()) : undefined}
        aria-autocomplete="list"
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onInput={(e) => {
          setQuery(e.currentTarget.value);
          setOpen(true);
          setActive(firstEnabled());
        }}
        // A click, not focus: a dialog handing the field focus must not pop
        // the list, and a click has to reopen it once the field already has focus.
        onClick={() => !open() && openList()}
        onKeyDown={handleKeyDown}
      />
      <svg
        class="so-combobox__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m5 9 7 7 7-7" />
      </svg>
      <Show when={open()}>
        <Portal>
          <ul ref={setListRef} id={listId} class="so-combobox__list" data-density={local.density} role="listbox">
            <Show
              when={matches().length > 0}
              fallback={
                <li class="so-combobox__empty" role="presentation">
                  {local.emptyLabel ?? "No results"}
                </li>
              }
            >
              <For each={matches()}>
                {(option, i) => (
                  <li
                    id={optionId(i())}
                    class={cls(
                      "so-combobox__option",
                      i() === active() && "so-combobox__option--active",
                      option.disabled && "so-combobox__option--disabled",
                    )}
                    role="option"
                    aria-selected={option.value === local.value}
                    aria-disabled={option.disabled || undefined}
                    // mousedown is prevented so the input keeps focus; the pick
                    // itself waits for click, so a touch scroll does not commit.
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(option)}
                    onMouseEnter={() => !option.disabled && setActive(i())}
                  >
                    {option.label}
                  </li>
                )}
              </For>
            </Show>
          </ul>
        </Portal>
      </Show>
      <Show when={open() && enabled().length === 0}>
        <VisuallyHidden aria-live="polite">{local.emptyLabel ?? "No results"}</VisuallyHidden>
      </Show>
    </div>
  );
}

export function Combobox<T extends string = string>(props: ComboboxProps<T>) {
  const [field, control] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={<ComboboxControl {...control} required={field.required} class={field.class} density={field.density} />}
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
          <ComboboxControl {...control} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
