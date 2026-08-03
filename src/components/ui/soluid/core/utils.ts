import type { JSX } from "solid-js";

/** Join class names, filtering out falsy values */
export function cls(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Merge a component's own inline style with the caller's.
 *
 * Spreading caller props over an element that already sets `style` replaces the
 * whole declaration, silently dropping what the component needs to work. Split
 * `style` out of the spread and pass it here instead. The caller wins on
 * conflicts, so an explicit override still has the last word.
 */
export function mergeStyle(
  own: JSX.CSSProperties,
  caller: JSX.CSSProperties | string | undefined,
): JSX.CSSProperties | string {
  if (caller === undefined) return own;
  if (typeof caller === "string") {
    const ownText = Object.entries(own)
      .map(([prop, value]) => `${prop}:${value}`)
      .join(";");
    return `${ownText};${caller}`;
  }
  return { ...own, ...caller };
}
