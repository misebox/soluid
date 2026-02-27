import { onMount, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import { createActiveElement } from "@solid-primitives/active-element";
import { makeEventListener } from "@solid-primitives/event-listener";

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export interface FocusTrapOptions {
  /** Reactive accessor for the container element */
  container: Accessor<HTMLElement | undefined>;
  /** Whether the trap is active */
  isActive: Accessor<boolean>;
  /** Called when Escape is pressed */
  onClose?: () => void;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function createFocusTrap(options: FocusTrapOptions): void {
  const activeElement = createActiveElement();
  let previouslyFocused: Element | null = null;

  onMount(() => {
    if (options.isActive()) {
      previouslyFocused = activeElement();
      focusFirst();
    }
  });

  function focusFirst(): void {
    const el = options.container();
    if (!el) return;
    const focusable = getFocusableElements(el);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (!options.isActive()) return;

    if (e.key === "Escape") {
      options.onClose?.();
      return;
    }

    if (e.key !== "Tab") return;

    const el = options.container();
    if (!el) return;

    const focusable = getFocusableElements(el);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  makeEventListener(document, "keydown", handleKeyDown);

  onCleanup(() => {
    if (previouslyFocused && previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    }
  });
}
