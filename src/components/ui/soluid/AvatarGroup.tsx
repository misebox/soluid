import { children, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, Size } from "./core/types";
import { cls } from "./core/utils";

export interface AvatarGroupProps extends CommonProps {
  /** Avatars to show before collapsing the rest into a +N chip */
  max?: number;
  /** Size of the overflow chip; match the Avatar size you pass in */
  size?: Size;
  /** Accessible label for the overflow chip, given the hidden count */
  overflowLabel?: (count: number) => string;
  children: JSX.Element;
}

export function AvatarGroup(props: AvatarGroupProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "density", "max", "size", "overflowLabel", "children"]);

  const avatars = children(() => local.children);

  const limit = () => (Number.isFinite(local.max) ? Math.max(0, Math.trunc(local.max ?? 0)) : Number.POSITIVE_INFINITY);
  const visible = () => avatars.toArray().slice(0, limit());
  const hidden = () => Math.max(0, avatars.toArray().length - limit());

  return (
    <div class={cls("so-avatar-group", local.class)} data-density={local.density} {...others}>
      {visible()}
      <Show when={hidden() > 0}>
        <span
          class={cls("so-avatar", `so-avatar--${local.size ?? "md"}`, "so-avatar-group__overflow")}
          role="img"
          aria-label={local.overflowLabel?.(hidden()) ?? `${hidden()} more`}
        >
          +{hidden()}
        </span>
      </Show>
    </div>
  );
}
