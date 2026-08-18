import type { JSX } from "solid-js";

// --- Density / Size / Variant ---

export type Density = "normal" | "dense";
export type Size = "sm" | "md" | "lg";

/** For the controls that only come in two sizes. */
export type SmallSize = Extract<Size, "sm" | "md">;

/** Subtle keeps the tinted background; solid fills with the base colour. */
export type Fill = "subtle" | "solid";

export type Variant = "primary" | "neutral" | "danger" | "success" | "warning" | "info";

export type ButtonVariant = Extract<Variant, "primary" | "neutral" | "danger"> | "ghost";
export type FeedbackVariant = Extract<Variant, "success" | "danger" | "warning" | "info">;

// --- Layout ---
// Named rather than written inline so the API table can stay narrow: spelled
// out, a union of five members pushes the Type column into the description.

export type Align = "start" | "center" | "end" | "stretch";
/** Alignment for text and table cells, which have no stretch. */
export type TextAlign = "start" | "center" | "end";
export type Justify = "start" | "center" | "end" | "between" | "around";
export type Orientation = "horizontal" | "vertical";

/** Step on the spacing scale, resolved to `--so-space-{n}`. */
export type Gap = 1 | 2 | 3 | 4 | 5 | 6;

/** Fixed column count for the grid layouts. */
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;

/** First column of the week: 0 is Sunday, 1 is Monday. */
export type WeekStart = 0 | 1;

// --- Common Props ---

export interface CommonProps {
  class?: string;
  density?: Density;
}

export interface InteractiveProps extends CommonProps {
  disabled?: boolean;
  size?: Size;
}

export interface VariantProps<V extends string = Variant> extends InteractiveProps {
  variant?: V;
}

// --- Theme ---

export interface ColorDefinition {
  name: string;
  base: string;
}

// --- Utility types ---

export type DataAttributes = Record<`data-${string}`, string | undefined>;

export type HTMLProps<T extends HTMLElement = HTMLElement> = JSX.HTMLAttributes<T>;
