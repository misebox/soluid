import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { createEffect, createSignal, createUniqueId, For, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { claimEscape, isInsideNewerLayer, takeEscape } from "./core/createFocusTrap";
import type { InteractiveProps } from "./core/types";
import { cls } from "./core/utils";
import { Portal } from "solid-js/web";
import { FormField } from "./FormField";
import { useFormField } from "./FormFieldContext";

const DEFAULT_SWATCHES = [
  "#0f172a",
  "#64748b",
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
];

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Colours are `#rrggbb`, the form `<input type="color">` accepts. */
/** Native button attributes minus the ones this component owns. */
type TriggerAttributes = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick" | "type" | "class" | "size" | "value"
>;

export interface ColorPickerControlProps extends InteractiveProps, TriggerAttributes {
  value?: string;
  /** Submitted through a hidden field, since the trigger is a button */
  name?: string;
  onChange?: (value: string) => void;
  /** Preset colours offered in the panel */
  swatches?: string[];
  required?: boolean;
  id?: string;
  /** Accessible label for the panel */
  panelLabel?: string;
  /** Accessible label for a preset, given its hex value */
  swatchLabel?: (color: string) => string;
  /** Label for the native colour input inside the panel */
  customLabel?: string;
  /** Label for the hex text field inside the panel */
  hexLabel?: string;
}

export interface ColorPickerProps extends ColorPickerControlProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function ColorPickerControl(props: ColorPickerControlProps) {
  const [local, others] = splitProps(props, [
    "value",
    "onChange",
    "swatches",
    "size",
    "class",
    "density",
    "id",
    "disabled",
    "required",
    "name",
    "panelLabel",
    "swatchLabel",
    "customLabel",
    "hexLabel",
  ]);

  const ctx = useFormField();
  const panelId = `so-color-picker-${createUniqueId()}`;

  const [open, setOpen] = createSignal(false);
  // Kept apart from `value` so a half-typed hex does not fire onChange.
  const [draft, setDraft] = createSignal<string | null>(null);

  let triggerRef: HTMLButtonElement | undefined;
  const [panelRef, setPanelRef] = createSignal<HTMLDivElement | undefined>(undefined);

  const color = () => local.value ?? "#000000";
  const swatches = () => local.swatches ?? DEFAULT_SWATCHES;

  function close(): void {
    setOpen(false);
    setDraft(null);
    triggerRef?.focus();
  }

  function commit(next: string): void {
    local.onChange?.(next);
  }

  function handleHexInput(text: string): void {
    setDraft(text);
    if (HEX.test(text)) commit(text.toLowerCase());
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
      panel.dataset.soPlaced = "";
    });
  }

  createEffect(() => {
    const panel = panelRef();
    if (!open() || !triggerRef || !panel) return;
    onCleanup(autoUpdate(triggerRef, panel, updatePosition));
  });

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape" && takeEscape(panelId, e)) close();
  }

  function handleClickOutside(e: MouseEvent): void {
    const target = e.target as Node;
    if (triggerRef?.contains(target)) return;
    if (panelRef()?.contains(target)) return;
    if (isInsideNewerLayer(panelId, e)) return;
    setOpen(false);
    setDraft(null);
  }

  createEffect(() => {
    if (!open()) return;
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(claimEscape(panelId, panelRef()));
    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  // Disabled while open: drop the panel, or it keeps taking picks.
  createEffect(() => {
    if (!local.disabled) return;
    setOpen(false);
    setDraft(null);
  });

  return (
    <div
      class={cls("so-color-picker", `so-color-picker--${local.size ?? "md"}`, local.class)}
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
        class="so-color-picker__trigger"
        disabled={local.disabled}
        aria-required={local.required || undefined}
        aria-haspopup="dialog"
        aria-expanded={open()}
        aria-controls={open() ? panelId : undefined}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={ctx?.hasError ? ctx.errorId : ctx?.hintId}
        onClick={() => setOpen(!open())}
      >
        <span class="so-color-picker__preview" style={{ "background-color": color() }} aria-hidden="true" />
        <span class="so-color-picker__hex">{color()}</span>
      </button>

      <Show when={open()}>
        <Portal>
          <div
            ref={setPanelRef}
            id={panelId}
            class="so-color-picker__panel"
            role="dialog"
            aria-label={local.panelLabel ?? "Choose a colour"}
          >
            <div class="so-color-picker__swatches">
              <For each={swatches()}>
                {(swatch) => (
                  <button
                    type="button"
                    class={cls(
                      "so-color-picker__swatch",
                      swatch.toLowerCase() === color().toLowerCase() && "so-color-picker__swatch--selected",
                    )}
                    style={{ "background-color": swatch }}
                    aria-label={local.swatchLabel?.(swatch) ?? swatch}
                    aria-pressed={swatch.toLowerCase() === color().toLowerCase()}
                    onClick={() => {
                      commit(swatch.toLowerCase());
                      close();
                    }}
                  />
                )}
              </For>
            </div>

            <label class="so-color-picker__field">
              <span class="so-color-picker__field-label">{local.customLabel ?? "Custom"}</span>
              <input
                class="so-color-picker__native"
                type="color"
                value={color()}
                onInput={(e) => commit(e.currentTarget.value)}
              />
            </label>

            <label class="so-color-picker__field">
              <span class="so-color-picker__field-label">{local.hexLabel ?? "Hex"}</span>
              <input
                class="so-color-picker__hex-input"
                type="text"
                inputMode="text"
                spellcheck={false}
                maxLength={7}
                value={draft() ?? color()}
                onInput={(e) => handleHexInput(e.currentTarget.value)}
                onBlur={() => setDraft(null)}
              />
            </label>
          </div>
        </Portal>
      </Show>
    </div>
  );
}

export function ColorPicker(props: ColorPickerProps) {
  const [field, control] = splitProps(props, ["label", "error", "hint", "required", "class", "density"]);

  return (
    <Show
      when={field.label}
      fallback={
        <ColorPickerControl {...control} required={field.required} class={field.class} density={field.density} />
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
          <ColorPickerControl {...control} required={field.required} />
        </FormField>
      )}
    </Show>
  );
}
