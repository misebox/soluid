import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { cls } from "../../core/utils";
import "./Spacer.css";

export function Spacer(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={cls("soui-spacer", local.class)}
      aria-hidden="true"
      {...others}
    />
  );
}
