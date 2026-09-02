import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { createEffect, createSignal, createUniqueId, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { Calendar } from "./Calendar";
import { claimEscape, getFocusableElements, isInsideNewerLayer, takeEscape } from "./core/createFocusTrap";
import type { InteractiveProps, WeekStart } from "./core/types";
import { cls } from "./core/utils";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";
import { VisuallyHidden } from "./VisuallyHidden";

/** Native button attributes minus the ones this component owns. */
type TriggerAttributes = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick" | "type" | "class" | "size" | "value"
>;

export interface DatePickerControlProps extends InteractiveProps, TriggerAttributes {
  /** Selected day as `YYYY-MM-DD` */
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  weekStartsOn?: WeekStart;
  locale?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
  /** Formats the value for the field; defaults to the raw ISO string */
  format?: (value: string) => string;
  /** Accessible label for the calendar panel and its grid (default: "Choose a date") */
  openLabel?: string;
}

export interface DatePickerProps extends DatePickerControlProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function DatePickerControl(props: DatePickerControlProps) {
  const [local, others] = splitProps(props, [
    "value",
    "onChange",
    "min",
    "max",
    "weekStartsOn",
    "locale",
    "placeholder",
    "size",
    "class",
    "density",
    "id",
    "disabled",
    "format",
    "openLabel",
    "name",
    "required",
  ]);

  const ctx = useFormField();
  const panelId = `so-date-picker-${createUniqueId()}`;

  const [open, setOpen] = createSignal(false);
  let triggerRef: HTMLButtonElement | undefined;
  const [panelRef, setPanelRef] = createSignal<HTMLDivElement | undefined>(undefined);

  const display = () => (local.value ? (local.format?.(local.value) ?? local.value) : "");

  function close(): void {
    setOpen(false);
    triggerRef?.focus();
  }

  function updatePosition(): void {
    const panel = panelRef();
    if (!triggerRef || !panel) return;
    computePosition(triggerRef, panel, {
      placement: "bottom-start",
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      // Until this runs the panel sits at the document origin, so the CSS keeps
      // it hidden and nothing can focus or measure it there.
      const firstPlacement = panel.dataset.soPlaced === undefined;
      panel.dataset.soPlaced = "";
      // Hand focus to whichever day the calendar made its tab stop, now that
      // the panel is where it belongs. preventScroll guards the ordering.
      if (firstPlacement) {
        panel.querySelector<HTMLButtonElement>('[data-so-day][tabindex="0"]')?.focus({ preventScroll: true });
      }
    });
  }

  createEffect(() => {
    const panel = panelRef();
    if (!open() || !triggerRef || !panel) return;
    onCleanup(autoUpdate(triggerRef, panel, updatePosition));
  });

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      if (takeEscape(panelId, e)) close();
      return;
    }
    if (e.key !== "Tab") return;

    const panel = panelRef();
    const active = document.activeElement;
    if (!panel || !(active instanceof HTMLElement) || !panel.contains(active)) return;
    // Leaving the panel: close it and carry on from the trigger. Backwards
    // that means landing on the trigger itself.
    const items = getFocusableElements(panel);
    const atEdge = e.shiftKey ? active === items[0] : active === items[items.length - 1];
    if (!atEdge && items.length > 0) return;
    if (e.shiftKey) e.preventDefault();
    close();
  }

  function handleClickOutside(e: MouseEvent): void {
    const target = e.target as Node;
    if (triggerRef?.contains(target)) return;
    if (panelRef()?.contains(target)) return;
    if (isInsideNewerLayer(panelId, e)) return;
    setOpen(false);
  }

  createEffect(() => {
    if (!open()) return;
    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(claimEscape(panelId, panelRef(), triggerRef));
    onCleanup(() => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  // Disabled while open: drop the panel, or it keeps taking picks.
  createEffect(() => {
    if (local.disabled) setOpen(false);
  });

  return (
    <div
      class={cls("so-date-picker", `so-date-picker--${local.size ?? "md"}`, local.class)}
      data-density={local.density}
    >
      {/* The trigger is a button, so the form needs its own field to submit. Not
          type="hidden": hidden inputs are barred from constraint validation, so
          `required` would never fire. */}
      <Show when={local.name}>
        {(name) => (
          <VisuallyHidden>
            <input
              type="text"
              tabIndex={-1}
              aria-hidden="true"
              name={name()}
              value={local.value ?? ""}
              required={local.required}
              disabled={local.disabled}
              onInput={(e) => (e.currentTarget.value = local.value ?? "")}
            />
          </VisuallyHidden>
        )}
      </Show>
      <button
        {...others}
        ref={triggerRef}
        type="button"
        id={ctx?.id ?? local.id}
        class="so-date-picker__trigger"
        // A combobox like the TimePicker trigger: a plain button may carry neither
        // aria-required nor an active descendant.
        role="combobox"
        disabled={local.disabled}
        aria-required={local.required || undefined}
        aria-haspopup="dialog"
        aria-expanded={open()}
        aria-controls={open() ? panelId : undefined}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onClick={() => setOpen(!open())}
      >
        <Show when={display()} fallback={<span class="so-date-picker__placeholder">{local.placeholder}</span>}>
          {(text) => <span class="so-date-picker__value">{text()}</span>}
        </Show>
        <svg
          class="so-date-picker__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      <Show when={open()}>
        <Portal>
          <div
            ref={setPanelRef}
            id={panelId}
            class="so-date-picker__panel"
            data-density={local.density}
            role="dialog"
            aria-label={local.openLabel ?? "Choose a date"}
          >
            <Calendar
              value={local.value}
              min={local.min}
              max={local.max}
              weekStartsOn={local.weekStartsOn}
              locale={local.locale}
              label={local.openLabel ?? "Choose a date"}
              onChange={(next) => {
                local.onChange?.(next);
                close();
              }}
            />
          </div>
        </Portal>
      </Show>
    </div>
  );
}

export function DatePicker(props: DatePickerProps) {
  const [field, control] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={
        <DatePickerControl {...control} required={field.required} class={field.class} density={field.density} />
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
          <DatePickerControl {...control} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
