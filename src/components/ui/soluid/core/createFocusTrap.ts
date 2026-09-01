import { makeEventListener } from "@solid-primitives/event-listener";
import { createEffect, createUniqueId, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import { isServer } from "solid-js/web";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
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

/**
 * Open overlays, oldest first. Escape belongs to the last one, so a Dialog
 * behind a Drawer does not close along with it.
 */
const openTraps: string[] = [];

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true",
  );
}

export function createFocusTrap(options: FocusTrapOptions): void {
  const id = createUniqueId();

  function focusFirst(container: HTMLElement): void {
    const focusable = getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0].focus();
      return;
    }
    // An overlay with nothing to focus still has to take focus, or the reader
    // is left behind on the page underneath.
    if (!container.hasAttribute("tabindex")) container.setAttribute("tabindex", "-1");
    container.focus();
  }

  // The container only exists once the overlay has rendered, which is a tick
  // after `isActive` turns true — so both are tracked, and focus moves as soon
  // as there is somewhere to put it.
  createEffect(() => {
    const container = options.container();
    if (!options.isActive() || !container) return;

    const active = document.activeElement;
    const restoreTo = active instanceof HTMLElement && !container.contains(active) ? active : undefined;

    openTraps.push(id);
    onCleanup(() => {
      const index = openTraps.lastIndexOf(id);
      if (index !== -1) openTraps.splice(index, 1);
      // Hand focus back to whatever opened the overlay, as long as it is still
      // on the page. This runs when the overlay closes, not when the component
      // holding it is finally disposed of.
      if (restoreTo?.isConnected) restoreTo.focus();
    });

    if (!container.contains(document.activeElement)) focusFirst(container);
  });

  function handleKeyDown(e: KeyboardEvent): void {
    if (!options.isActive()) return;
    // Only the overlay on top responds; the ones underneath stay open.
    if (openTraps[openTraps.length - 1] !== id) return;

    if (e.key === "Escape") {
      options.onClose?.();
      return;
    }

    if (e.key !== "Tab") return;

    const container = options.container();
    if (!container) return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    // Focus can sit outside the overlay — a click on the backdrop, or a trap
    // that opened with nothing focusable. Tab has to pull it back in rather
    // than walk off into the page behind.
    if (!container.contains(active)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
      return;
    }

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Guarded because `document` is evaluated here, at component setup: without
  // this, rendering a Dialog or Drawer on the server throws before the listener
  // is even reached. There is nothing to listen for there anyway.
  if (!isServer) makeEventListener(document, "keydown", handleKeyDown);
}
