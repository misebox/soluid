import { createEffect, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import { isServer } from "solid-js/web";

/**
 * Holds the page still while a modal overlay is open.
 *
 * Overlays nest — a Dialog can open a Drawer — so holders are counted and the
 * page is only released once the last one lets go.
 */
let holders = 0;
let release: (() => void) | undefined;

/**
 * iOS ignores `overflow: hidden` on the scrolling element, so the page has to
 * be pinned instead. iPadOS reports itself as a Mac, which is why the touch
 * points are checked; `navigator.platform` is deprecated but still the only
 * thing that separates the two.
 */
function isIos(): boolean {
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function apply(): () => void {
  const doc = document.documentElement;
  const body = document.body;
  const previousHtmlOverflow = doc.style.overflow;
  const previousBodyOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;

  // The scrollbar goes away with the scroll, so pad by its width to stop the
  // page shifting sideways underneath the overlay.
  const scrollbar = window.innerWidth - doc.clientWidth;
  if (scrollbar > 0 && doc.scrollHeight > doc.clientHeight) {
    const current = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbar}px`;
  }

  // Set on both: the viewport takes its overflow from <html>, and only falls
  // back to <body> while <html> is still `visible`.
  doc.style.overflow = "hidden";
  body.style.overflow = "hidden";

  function restore(): void {
    doc.style.overflow = previousHtmlOverflow;
    body.style.overflow = previousBodyOverflow;
    body.style.paddingRight = previousPaddingRight;
  }

  if (!isIos()) return restore;

  const scrollY = window.scrollY;
  const previousPosition = body.style.position;
  const previousTop = body.style.top;
  const previousWidth = body.style.width;
  body.style.position = "fixed";
  body.style.top = `${-scrollY}px`;
  body.style.width = "100%";

  return () => {
    restore();
    body.style.position = previousPosition;
    body.style.top = previousTop;
    body.style.width = previousWidth;
    window.scrollTo(0, scrollY);
  };
}

/** Takes a hold on the page scroll. Call the returned function to let go. */
export function acquireScrollLock(): () => void {
  if (holders === 0) release = apply();
  holders += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders === 0) {
      release?.();
      release = undefined;
    }
  };
}

/** Locks the page scroll for as long as `isActive` is true. */
export function createScrollLock(isActive: Accessor<boolean>): void {
  if (isServer) return;

  createEffect(() => {
    if (!isActive()) return;
    onCleanup(acquireScrollLock());
  });
}
