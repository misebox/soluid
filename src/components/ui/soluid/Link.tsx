import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { VisuallyHidden } from "./VisuallyHidden";

export interface LinkProps extends CommonProps {
  href?: string;
  /** Open in a new tab, with the matching rel and an announced hint */
  external?: boolean;
  /** Text appended for screen readers on external links */
  externalLabel?: string;
  underline?: "always" | "hover" | "none";
  tone?: "primary" | "neutral" | "danger";
  children: JSX.Element;
}

export function Link(props: LinkProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "external",
    "externalLabel",
    "underline",
    "tone",
    "children",
  ]);

  return (
    <a
      // noreferrer alongside noopener keeps the referrer off cross-origin tabs.
      target={local.external ? "_blank" : undefined}
      rel={local.external ? "noopener noreferrer" : undefined}
      class={cls(
        "so-link",
        `so-link--${local.tone ?? "primary"}`,
        `so-link--underline-${local.underline ?? "hover"}`,
        local.class,
      )}
      data-density={local.density}
      {...others}
    >
      {local.children}
      <Show when={local.external}>
        <svg class="so-link__external-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M4.5 2h5.5v5.5M10 2L5 7M8 8v2H2V4h2"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <VisuallyHidden>{local.externalLabel ?? "(opens in a new tab)"}</VisuallyHidden>
      </Show>
    </a>
  );
}
