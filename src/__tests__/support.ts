/** Helpers shared by the component tests. Not a suite: the include pattern takes `*.test.ts(x)`. */

/**
 * The item at `index`. A list that came up short fails the test with the
 * position it was asked for, rather than surfacing as `undefined` three
 * assertions later.
 */
export function nth<T>(items: ArrayLike<T>, index: number): T {
  const item = items[index];
  if (item === undefined) throw new Error(`no item at index ${index} of ${items.length}`);
  return item;
}
