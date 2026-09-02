import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface BreadcrumbProps extends CommonProps {
  /** Accessible label for the navigation landmark (default: "Breadcrumb") */
  label?: string;
  children: JSX.Element;
}

export interface BreadcrumbItemProps {
  href?: string;
  current?: boolean;
  class?: string;
  children: JSX.Element;
}

export function Breadcrumb(props: BreadcrumbProps & Omit<JSX.HTMLAttributes<HTMLElement>, "aria-label">) {
  const [local, others] = splitProps(props, ["class", "density", "label", "children"]);

  return (
    <nav
      class={cls("so-breadcrumb", local.class)}
      aria-label={local.label ?? "Breadcrumb"}
      data-density={local.density}
      {...others}
    >
      <ol class="so-breadcrumb__list">{local.children}</ol>
    </nav>
  );
}

export function BreadcrumbItem(props: BreadcrumbItemProps & Omit<JSX.LiHTMLAttributes<HTMLLIElement>, "aria-current">) {
  const [local, others] = splitProps(props, ["href", "current", "class", "children"]);

  return (
    <li
      class={cls("so-breadcrumb__item", local.current && "so-breadcrumb__item--current", local.class)}
      {...(local.current ? { "aria-current": "page" } : {})}
      {...others}
    >
      <Show when={local.href && !local.current} fallback={<span>{local.children}</span>}>
        <a href={local.href}>{local.children}</a>
      </Show>
    </li>
  );
}
