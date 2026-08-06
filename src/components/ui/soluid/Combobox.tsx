import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import { createEffect, createMemo, createSignal, createUniqueId, For, onCleanup, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
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

export interface ComboboxControlProps<T extends string = string> extends InteractiveProps {
  value?: T;
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

  function openList(): void {
    if (local.disabled) return;
    setQuery("");
    setActive(0);
    setOpen(true);
  }

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
      if (!open()) return;
      e.preventDefault();
      e.stopPropagation();
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
          apply({ rects, elements }) {
            elements.floating.style.width = `${rects.reference.width}px`;
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
    closeList();
  }

  createEffect(() => {
    if (!open()) return;
    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));
  });

  return (
    <div class={cls("so-combobox", `so-combobox--${local.size ?? "md"}`, local.class)}>
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
        aria-expanded={open()}
        aria-controls={open() ? listId : undefined}
        aria-activedescendant={open() ? optionId(active()) : undefined}
        aria-autocomplete="list"
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onInput={(e) => {
          setQuery(e.currentTarget.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={openList}
        onKeyDown={handleKeyDown}
      />
      <svg class="so-combobox__arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M2.5 4.5L6 8l3.5-3.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <Show when={open()}>
        <Portal>
          <ul ref={setListRef} id={listId} class="so-combobox__list" role="listbox">
            <Show
              when={matches().length > 0}
              fallback={<li class="so-combobox__empty">{local.emptyLabel ?? "No results"}</li>}
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
                    // mousedown fires before the input's blur, so the click is
                    // not lost to the list closing first.
                    onMouseDown={(e) => {
                      e.preventDefault();
                      commit(option);
                    }}
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
