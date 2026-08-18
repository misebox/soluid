import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { Align, CommonProps, Gap, Justify } from "./core/types";
import { cls } from "./core/utils";

export interface HStackProps extends CommonProps {
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  children: JSX.Element;
}

export function HStack(props: HStackProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "gap", "align", "justify", "wrap", "children"]);

  return (
    <div
      class={cls(
        "so-hstack",
        local.gap !== undefined && `so-hstack--gap-${local.gap}`,
        local.align && `so-hstack--align-${local.align}`,
        local.justify && `so-hstack--justify-${local.justify}`,
        local.wrap && "so-hstack--wrap",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}
