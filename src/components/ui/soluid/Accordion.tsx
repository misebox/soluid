import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface AccordionProps extends CommonProps {
  children: JSX.Element;
}

export interface AccordionItemProps {
  title: string;
  open?: boolean;
  disabled?: boolean;
  class?: string;
  children: JSX.Element;
}

export function Accordion(props: AccordionProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "children",
  ]);

  return (
    <div
      class={cls("so-accordion", local.class)}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </div>
  );
}

export function AccordionItem(props: AccordionItemProps) {
  const [local, others] = splitProps(props, [
    "title",
    "open",
    "disabled",
    "class",
    "children",
  ]);

  return (
    <details
      class={cls(
        "so-accordion-item",
        local.disabled && "so-accordion-item--disabled",
        local.class,
      )}
      open={local.open}
      {...others}
    >
      <summary
        class="so-accordion-item__trigger"
        onClick={(e) => {
          if (local.disabled) {
            e.preventDefault();
          }
        }}
      >
        <span class="so-accordion-item__title">{local.title}</span>
        <svg
          class="so-accordion-item__chevron"
          width="16"
          height="16"
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
      </summary>
      <div class="so-accordion-item__content">
        {local.children}
      </div>
    </details>
  );
}
