import { splitProps } from "solid-js";
import type { JSX } from "solid-js";

// TODO: Implement with Popover primitive once available.

export interface TooltipProps {
  content?: string;
  children: JSX.Element;
}

export function Tooltip(props: TooltipProps) {
  const [local] = splitProps(props, ["children"]);

  return <>{local.children}</>;
}
