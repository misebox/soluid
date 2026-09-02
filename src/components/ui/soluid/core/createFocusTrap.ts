import { createEffect, createUniqueId, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import { isServer } from "solid-js/web";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "iframe",
  "audio[controls]",
  "video[controls]",
  '[contenteditable="true"]',
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

/** Open traps, oldest first. Tab is steered by the last one only. */
const openTraps: string[] = [];

interface EscapeOwner {
  id: string;
  /** Opening order; a higher number sits on top. */
  layer: number;
  /** The overlay itself, and whatever opened it. */
  panel?: HTMLElement;
  anchor?: HTMLElement;
}

/**
 * Everything that closes on Escape — traps, menus, popovers, picker panels —
 * oldest first. The newest one the keyboard is actually in acts on the key, so
 * a Menu inside a Dialog does not take the Dialog down with it, and a Popover
 * open elsewhere on the page does not answer for the Dialog you are typing in.
 */
const escapeOwners: EscapeOwner[] = [];
let layerCount = 0;

/**
 * Claims Escape for `id` while it is open. The returned function gives it back.
 * `panel` is stamped with its layer, which is what lets an overlay underneath
 * tell a press inside a nested panel from a press outside. `anchor` is whatever
 * opened the overlay; for a picker whose focus stays on its trigger, that is
 * the only way to tell the keyboard is still in it.
 */
export function claimEscape(id: string, panel?: HTMLElement, anchor?: HTMLElement): () => void {
  // A panel claiming again after an aborted close keeps its place, so it does
  // not jump above an overlay that opened inside it in the meantime.
  const stamped = Number(panel?.dataset.soLayer);
  const owner: EscapeOwner = { id, layer: stamped > 0 ? stamped : ++layerCount, panel, anchor };
  if (panel) panel.dataset.soLayer = String(owner.layer);
  const above = escapeOwners.findIndex((other) => other.layer > owner.layer);
  escapeOwners.splice(above === -1 ? escapeOwners.length : above, 0, owner);
  return () => {
    const index = escapeOwners.indexOf(owner);
    if (index !== -1) escapeOwners.splice(index, 1);
  };
}

/**
 * Whether the event started inside an overlay opened after `id`. Nested panels
 * are portaled out of their parent's DOM, so `contains` cannot tell a press on
 * a day in a DatePicker inside a Popover from a press outside the Popover. The
 * event path is used rather than the live tree because the inner panel may
 * already have closed itself on this same event.
 */
export function isInsideNewerLayer(id: string, e: Event): boolean {
  const own = escapeOwners.find((owner) => owner.id === id)?.layer ?? Number.POSITIVE_INFINITY;
  return e.composedPath().some((node) => node instanceof HTMLElement && Number(node.dataset.soLayer) > own);
}

/**
 * Whether `id` should act on this Escape: it is the newest owner the keyboard
 * is in, and no other handler has taken the key yet. Marks the event taken.
 */
export function takeEscape(id: string, e: KeyboardEvent): boolean {
  if (e.defaultPrevented) return false;
  const active = document.activeElement;
  const holdsFocus = (owner: EscapeOwner) =>
    owner.panel?.contains(active) === true || owner.anchor?.contains(active) === true;
  // Focus can sit outside every overlay, after a backdrop click; then the
  // newest overall answers, as it did before.
  const reachable = escapeOwners.filter(holdsFocus);
  const candidates = reachable.length > 0 ? reachable : escapeOwners;
  if (candidates[candidates.length - 1]?.id !== id) return false;
  e.preventDefault();
  return true;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      !el.hasAttribute("hidden") &&
      el.getAttribute("aria-hidden") !== "true" &&
      // Roving-tabindex widgets park their other items at -1; Tab skips those.
      el.getAttribute("tabindex") !== "-1",
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
    const releaseEscape = claimEscape(id, container, container);
    onCleanup(() => {
      const index = openTraps.lastIndexOf(id);
      const wasOnTop = index === openTraps.length - 1;
      if (index !== -1) openTraps.splice(index, 1);
      releaseEscape();
      // Hand focus back to whatever opened the overlay, as long as it is still
      // on the page. This runs when the overlay closes, not when the component
      // holding it is finally disposed of. An overlay closing underneath
      // another one leaves focus where it is, inside the one still open.
      if (wasOnTop && restoreTo?.isConnected) restoreTo.focus();
    });

    if (!container.contains(document.activeElement)) focusFirst(container);
  });

  function handleKeyDown(e: KeyboardEvent): void {
    if (!options.isActive()) return;

    if (e.key === "Escape") {
      if (takeEscape(id, e)) options.onClose?.();
      return;
    }

    if (e.key !== "Tab") return;
    // Only the trap on top steers Tab; the ones underneath stay put.
    if (openTraps[openTraps.length - 1] !== id) return;

    const container = options.container();
    if (!container) return;

    const active = document.activeElement;
    // A menu, popover or picker panel opened from inside is portaled outside
    // the container and claimed Escape after this trap did; while focus sits
    // in it, Tab belongs to that layer.
    if (!container.contains(active) && escapeOwners[escapeOwners.length - 1]?.id !== id) return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

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

  // Only while the overlay is open: a page holding one closed Dialog per table
  // row would otherwise route every keystroke through a handler per row. The
  // effect also keeps `document` off the server, where there is nothing to hear.
  createEffect(() => {
    if (isServer || !options.isActive()) return;
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });
}
