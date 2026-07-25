import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { cls } from "./core/utils";

export type SpacerProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Spacer(props: SpacerProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <div class={cls("so-spacer", local.class)} aria-hidden="true" {...others} />;
}
