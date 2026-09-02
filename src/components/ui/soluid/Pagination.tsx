import { For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, SmallSize } from "./core/types";
import { cls } from "./core/utils";

export interface PaginationProps extends CommonProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: SmallSize;
  /** Show numbered page buttons (default: false for backward compatibility) */
  showPages?: boolean;
  /** Max visible page buttons before ellipsis (default: 5) */
  maxVisible?: number;
  /** Accessible label for the navigation landmark (default: "Pagination") */
  label?: string;
  /** Label for the previous-page button. Sets both its text and aria-label. */
  previousLabel?: string;
  /** Label for the next-page button. Sets both its text and aria-label. */
  nextLabel?: string;
  /** Accessible label for a numbered page button (default: `Page {n}`) */
  pageLabel?: (page: number) => string;
}

function buildPageList(current: number, total: number, maxVisible: number): (number | "ellipsis")[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const side = Math.floor((maxVisible - 3) / 2);
  const pages: (number | "ellipsis")[] = [1];

  let start = Math.max(2, current - side);
  let end = Math.min(total - 1, current + side);

  // Adjust if near edges
  if (current <= side + 2) {
    end = Math.min(total - 1, maxVisible - 2);
  }
  if (current >= total - side - 1) {
    start = Math.max(2, total - maxVisible + 3);
  }
  // The current page is always shown, even when maxVisible leaves no room for it.
  start = Math.min(start, Math.max(current, 2));
  end = Math.max(end, Math.min(current, total - 1));

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) {
    pages.push("ellipsis");
  }

  pages.push(total);
  return pages;
}

// onChange is omitted because PaginationProps redefines it with the page number.
export function Pagination(props: PaginationProps & Omit<JSX.HTMLAttributes<HTMLElement>, "onChange" | "aria-label">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "page",
    "totalPages",
    "onChange",
    "size",
    "showPages",
    "maxVisible",
    "label",
    "previousLabel",
    "nextLabel",
    "pageLabel",
  ]);

  const pageList = () => buildPageList(local.page, local.totalPages, local.maxVisible ?? 5);
  const pageLabel = (page: number) => local.pageLabel?.(page) ?? `Page ${page}`;

  return (
    <nav
      class={cls("so-pagination", `so-pagination--${local.size ?? "md"}`, local.class)}
      aria-label={local.label ?? "Pagination"}
      data-density={local.density}
      {...others}
    >
      <button
        type="button"
        class="so-pagination__button"
        disabled={local.page <= 1}
        onClick={() => local.onChange(local.page - 1)}
        aria-label={local.previousLabel ?? "Previous page"}
      >
        {local.previousLabel ?? "Prev"}
      </button>

      <Show
        when={local.showPages}
        fallback={
          <span class="so-pagination__info">
            {local.page} / {local.totalPages}
          </span>
        }
      >
        <For each={pageList()}>
          {(item) => (
            <Show
              when={item !== "ellipsis"}
              fallback={
                <span class="so-pagination__ellipsis" aria-hidden="true">
                  …
                </span>
              }
            >
              <button
                type="button"
                class={cls("so-pagination__page", local.page === item && "so-pagination__page--active")}
                aria-label={pageLabel(item as number)}
                aria-current={local.page === item ? "page" : undefined}
                onClick={() => local.onChange(item as number)}
              >
                {item}
              </button>
            </Show>
          )}
        </For>
      </Show>

      <button
        type="button"
        class="so-pagination__button"
        disabled={local.page >= local.totalPages}
        onClick={() => local.onChange(local.page + 1)}
        aria-label={local.nextLabel ?? "Next page"}
      >
        {local.nextLabel ?? "Next"}
      </button>
    </nav>
  );
}
