import { createSignal, Show, splitProps } from "solid-js";
import type { CommonProps } from "./core/types";
import type { Size, Variant } from "./core/types";
import { cls } from "./core/utils";

export interface AvatarProps extends CommonProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: Size;
  variant?: Extract<Variant, "primary" | "neutral" | "success" | "danger" | "warning" | "info">;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function Avatar(props: AvatarProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "src",
    "alt",
    "name",
    "size",
    "variant",
  ]);

  const [imgFailed, setImgFailed] = createSignal(false);

  const showImage = () => local.src && !imgFailed();
  const initials = () => (local.name ? getInitials(local.name) : "");

  return (
    <span
      class={cls(
        "so-avatar",
        `so-avatar--${local.size ?? "md"}`,
        `so-avatar--${local.variant ?? "neutral"}`,
        local.class,
      )}
      role="img"
      aria-label={local.alt ?? local.name}
      data-density={local.density}
      {...others}
    >
      <Show when={showImage()}>
        <img
          class="so-avatar__img"
          src={local.src}
          alt={local.alt ?? local.name ?? ""}
          onError={() => setImgFailed(true)}
        />
      </Show>
      <Show when={!showImage() && initials()}>
        <span class="so-avatar__initials" aria-hidden="true">
          {initials()}
        </span>
      </Show>
      <Show when={!showImage() && !initials()}>
        <svg
          class="so-avatar__fallback"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
        </svg>
      </Show>
    </span>
  );
}
