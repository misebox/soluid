import type { JSX } from "solid-js";

// --- Density / Size / Variant ---

export type Density = "normal" | "dense";
export type Size = "sm" | "md" | "lg";

export type Variant =
  | "primary"
  | "neutral"
  | "danger"
  | "success"
  | "warning"
  | "info";

export type ButtonVariant = Extract<Variant, "primary" | "neutral" | "danger"> | "ghost";
export type FeedbackVariant = Extract<
  Variant,
  "success" | "danger" | "warning" | "info"
>;

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
