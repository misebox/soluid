/** Join class names, filtering out falsy values */
export function cls(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
