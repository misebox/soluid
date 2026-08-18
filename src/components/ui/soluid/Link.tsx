import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";
import { VisuallyHidden } from "./VisuallyHidden";

export type LinkUnderline = "always" | "hover" | "none";
export type LinkTone = "primary" | "neutral" | "danger";

export interface LinkProps extends CommonProps {
  href?: string;
  /** Open in a new tab, with the matching rel and an announced hint */
  external?: boolean;
  /** Text appended for screen readers on external links */
  externalLabel?: string;
  underline?: LinkUnderline;
  tone?: LinkTone;
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
        <svg
          class="so-link__external-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M9 4h11v11M20 4 10 14M16 16v4H4V8h4" />
        </svg>
        <VisuallyHidden>{local.externalLabel ?? "(opens in a new tab)"}</VisuallyHidden>
      </Show>
    </a>
  );
}
