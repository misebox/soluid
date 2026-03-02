import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface PopoverProps extends CommonProps {
  children: JSX.Element;
}

/** Placeholder: full implementation requires floating-ui integration */
export function Popover(props: PopoverProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "children",
  ]);

  return (
    <div
      class={cls("so-popover", local.class)}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </div>
  );
}
