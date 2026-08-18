import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps extends CommonProps {
  /** Maximum content width (default: "lg") */
  size?: ContainerSize;
  /** Horizontal padding inside the container (default: true) */
  padded?: boolean;
  children: JSX.Element;
}

export function Container(props: ContainerProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "density", "size", "padded", "children"]);

  return (
    <div
      class={cls(
        "so-container",
        `so-container--${local.size ?? "lg"}`,
        local.padded !== false && "so-container--padded",
        local.class,
      )}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </div>
  );
}
