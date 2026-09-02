import { createSignal, Show, splitProps } from "solid-js";
import type { CommonProps } from "./core/types";
import type { Size, Variant } from "./core/types";
import { cls } from "./core/utils";

export interface AvatarProps extends CommonProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: Size;
  variant?: Variant;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function Avatar(props: AvatarProps) {
  const [local, others] = splitProps(props, ["class", "density", "src", "alt", "name", "size", "variant"]);

  // Remember which src failed so a new src gets its chance to load.
  const [failedSrc, setFailedSrc] = createSignal<string>();

  const showImage = () => local.src && failedSrc() !== local.src;
  const initials = () => (local.name ? getInitials(local.name) : "");
  // role="img" without a name is a violation, so an unnamed avatar stays a
  // plain decorative span rather than getting an invented English label.
  const label = () => local.alt ?? local.name;

  return (
    <span
      class={cls(
        "so-avatar",
        `so-avatar--${local.size ?? "md"}`,
        `so-avatar--${local.variant ?? "neutral"}`,
        local.class,
      )}
      role={label() ? "img" : undefined}
      aria-label={label()}
      data-density={local.density}
      {...others}
    >
      <Show when={showImage()}>
        <img
          class="so-avatar__img"
          src={local.src}
          alt={local.alt ?? local.name ?? ""}
          onError={() => setFailedSrc(local.src)}
        />
      </Show>
      <Show when={!showImage() && initials()}>
        <span class="so-avatar__initials" aria-hidden="true">
          {initials()}
        </span>
      </Show>
      <Show when={!showImage() && !initials()}>
        <svg class="so-avatar__fallback" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
        </svg>
      </Show>
    </span>
  );
}
