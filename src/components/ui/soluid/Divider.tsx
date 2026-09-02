import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Orientation } from "./core/types";
import { cls } from "./core/utils";

export interface DividerProps extends CommonProps {
  orientation?: Orientation;
}

export function Divider(props: DividerProps & JSX.HTMLAttributes<HTMLHRElement>) {
  const [local, others] = splitProps(props, ["class", "density", "orientation"]);

  const orientation = () => local.orientation ?? "horizontal";

  return (
    <hr
      class={cls("so-divider", `so-divider--${orientation()}`, local.class)}
      aria-orientation={orientation()}
      data-density={local.density}
      {...others}
    />
  );
}
