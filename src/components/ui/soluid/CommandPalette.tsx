import { createEffect, createMemo, createSignal, createUniqueId, For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { createOverlay } from "./core/createOverlay";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface Command {
  id: string;
  label: string;
  /** Optional heading the command is filed under */
  group?: string;
  /** Extra words the query should match, e.g. synonyms */
  keywords?: string;
  /** Shortcut shown on the right, e.g. "⌘K" */
  shortcut?: string;
  icon?: JSX.Element;
  disabled?: boolean;
}

export interface CommandPaletteProps extends CommonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: Command[];
  onSelect: (command: Command) => void;
  placeholder?: string;
  /** Shown when nothing matches (default: "No results") */
  emptyLabel?: string;
  /** Accessible label for the dialog */
  label?: string;
  /** Overrides the default case-insensitive match over label and keywords */
  filter?: (command: Command, query: string) => boolean;
}

function defaultFilter(command: Command, query: string): boolean {
  const haystack = `${command.label} ${command.keywords ?? ""}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function CommandPalette(props: CommandPaletteProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "open",
    "onOpenChange",
    "commands",
    "onSelect",
    "placeholder",
    "emptyLabel",
    "label",
    "filter",
  ]);

  const baseId = createUniqueId();
  const listId = `so-command-list-${baseId}`;
  const optionId = (index: number) => `so-command-option-${baseId}-${index}`;

  const [query, setQuery] = createSignal("");
  const [active, setActive] = createSignal(0);
  let inputRef: HTMLInputElement | undefined;

  const matches = createMemo(() => {
    const q = query().trim();
    if (q === "") return local.commands;
    const match = local.filter ?? defaultFilter;
    return local.commands.filter((command) => match(command, q));
  });

  /** Flat list with group headings folded in, so indices stay simple. */
  const rows = createMemo(() => {
    const result: ({ kind: "group"; label: string } | { kind: "command"; command: Command; index: number })[] = [];
    let index = 0;
    let currentGroup: string | undefined;
    for (const command of matches()) {
      if (command.group && command.group !== currentGroup) {
        currentGroup = command.group;
        result.push({ kind: "group", label: command.group });
      }
      result.push({ kind: "command", command, index });
      index += 1;
    }
    return result;
  });

  const selectable = () => matches().filter((command) => !command.disabled);
  const hasList = () => selectable().length > 0;

  // Commands can change while the palette is open; keep the highlight on a row that exists.
  createEffect(() => {
    if (matches().length > 0 && active() >= matches().length) setActive(0);
  });

  function move(offset: number): void {
    const list = matches();
    if (list.length === 0) return;
    let next = active();
    for (let i = 0; i < list.length; i++) {
      next = (next + offset + list.length) % list.length;
      if (!list[next].disabled) break;
    }
    setActive(next);
  }

  function run(command: Command | undefined): void {
    // The list stays on screen through the closing animation; a second press
    // there must not run the command again.
    if (!local.open || !command || command.disabled) return;
    local.onSelect(command);
    local.onOpenChange(false);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    // The Enter that confirms an IME composition is not a pick.
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(matches().length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(matches()[active()]);
    }
  }

  // Escape, the focus trap and restoring focus on close all come from the
  // same primitive Dialog uses.
  const overlay = createOverlay({
    isOpen: () => local.open,
    onClose: () => local.onOpenChange(false),
  });

  // Every opening starts from a clean query with the field focused.
  createEffect(() => {
    if (!local.open) return;
    setQuery("");
    setActive(0);
    queueMicrotask(() => inputRef?.focus());
  });

  // Keep the highlighted command in view as the arrow keys walk the list.
  createEffect(() => {
    if (!local.open) return;
    const index = active();
    queueMicrotask(() => document.getElementById(optionId(index))?.scrollIntoView({ block: "nearest" }));
  });

  return (
    <Show when={overlay.mounted()}>
      <Portal>
        <div
          class={cls("so-command-backdrop", overlay.closing() && "so-command-backdrop--closing", local.class)}
          data-density={local.density}
          on:mousedown={overlay.handleBackdropMouseDown}
          on:click={overlay.handleBackdropClick}
          onAnimationEnd={overlay.handleAnimationEnd}
          {...others}
        >
          <div
            ref={overlay.setContainerRef}
            class="so-command"
            role="dialog"
            aria-modal="true"
            aria-label={local.label}
          >
            <div class="so-command__search">
              <svg
                class="so-command__icon"
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
              <input
                ref={inputRef}
                class="so-command__input"
                type="text"
                role="combobox"
                autocomplete="off"
                placeholder={local.placeholder}
                value={query()}
                aria-expanded={hasList()}
                aria-controls={hasList() ? listId : undefined}
                aria-activedescendant={hasList() ? optionId(active()) : undefined}
                aria-autocomplete="list"
                onInput={(e) => {
                  setQuery(e.currentTarget.value);
                  setActive(0);
                }}
                onKeyDown={handleKeyDown}
              />
            </div>

            <Show when={hasList()} fallback={<p class="so-command__empty">{local.emptyLabel ?? "No results"}</p>}>
              <ul id={listId} class="so-command__list" role="listbox" aria-label={local.label}>
                <For each={rows()}>
                  {(row) => (
                    <Show
                      when={row.kind === "command" ? row : undefined}
                      fallback={
                        <li class="so-command__group" role="presentation">
                          {row.kind === "group" ? row.label : ""}
                        </li>
                      }
                    >
                      {(item) => (
                        <li
                          id={optionId(item().index)}
                          class={cls(
                            "so-command__option",
                            item().index === active() && "so-command__option--active",
                            item().command.disabled && "so-command__option--disabled",
                          )}
                          role="option"
                          aria-selected={item().index === active()}
                          aria-disabled={item().command.disabled || undefined}
                          // mousedown is prevented so the input keeps focus; the pick itself
                          // waits for click, so a touch scroll does not run the command.
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => run(item().command)}
                          onMouseEnter={() => !item().command.disabled && setActive(item().index)}
                        >
                          <Show when={item().command.icon}>
                            <span class="so-command__option-icon" aria-hidden="true">
                              {item().command.icon}
                            </span>
                          </Show>
                          <span class="so-command__option-label">{item().command.label}</span>
                          <Show when={item().command.shortcut}>
                            <kbd class="so-command__shortcut">{item().command.shortcut}</kbd>
                          </Show>
                        </li>
                      )}
                    </Show>
                  )}
                </For>
              </ul>
            </Show>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
