import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./Divider.css";

export interface DividerProps extends CommonProps {
  orientation?: "horizontal" | "vertical";
}

export function Divider(
  props: DividerProps & JSX.HTMLAttributes<HTMLHRElement>,
) {
  const [local, others] = splitProps(props, ["class", "orientation"]);

  const orientation = () => local.orientation ?? "horizontal";

  return (
    <hr
      class={cls(
        "soui-divider",
        `soui-divider--${orientation()}`,
        local.class,
      )}
      role="separator"
      aria-orientation={orientation()}
      {...others}
    />
  );
}
