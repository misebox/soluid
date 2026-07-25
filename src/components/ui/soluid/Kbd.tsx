import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface KbdProps extends CommonProps {
  size?: "sm" | "md";
  children: JSX.Element;
}

export function Kbd(props: KbdProps & JSX.HTMLAttributes<HTMLElement>) {
  const [local, others] = splitProps(props, ["class", "density", "size", "children"]);

  return (
    <kbd class={cls("so-kbd", `so-kbd--${local.size ?? "md"}`, local.class)} data-density={local.density} {...others}>
      {local.children}
    </kbd>
  );
}
