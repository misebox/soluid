import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface MenuProps extends CommonProps {
  children: JSX.Element;
}

/** Placeholder: full implementation requires Popover integration */
export function Menu(props: MenuProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "children",
  ]);

  return (
    <div
      class={cls("so-menu", local.class)}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </div>
  );
}
