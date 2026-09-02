import { createUniqueId, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface CollapsibleProps extends CommonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Trigger content. Pass a string for the default styling. */
  title: JSX.Element;
  disabled?: boolean;
  children: JSX.Element;
}

/**
 * Controlled single disclosure. Unlike Accordion — which wraps native
 * <details> and owns its own state — the open state lives with the caller,
 * so it can be driven from a signal, a route or a form.
 */
// `title` is omitted because CollapsibleProps redefines it as JSX.
export function Collapsible(props: CollapsibleProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "title">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "open",
    "onOpenChange",
    "title",
    "disabled",
    "children",
  ]);

  const id = createUniqueId();
  const triggerId = `so-collapsible-trigger-${id}`;
  const panelId = `so-collapsible-panel-${id}`;

  return (
    <div
      class={cls("so-collapsible", local.open && "so-collapsible--open", local.class)}
      data-density={local.density}
      {...others}
    >
      <button
        type="button"
        id={triggerId}
        class="so-collapsible__trigger"
        aria-expanded={local.open}
        aria-controls={panelId}
        disabled={local.disabled}
        onClick={() => local.onOpenChange(!local.open)}
      >
        <span class="so-collapsible__title">{local.title}</span>
        <svg
          class="so-collapsible__chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <Show when={local.open}>
        <div id={panelId} class="so-collapsible__panel" role="region" aria-labelledby={triggerId}>
          {local.children}
        </div>
      </Show>
    </div>
  );
}
