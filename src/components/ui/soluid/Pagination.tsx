import { For, Show, splitProps } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface PaginationProps extends CommonProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: "sm" | "md";
  /** Show numbered page buttons (default: false for backward compatibility) */
  showPages?: boolean;
  /** Max visible page buttons before ellipsis (default: 5) */
  maxVisible?: number;
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

export function Pagination(props: PaginationProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "page",
    "totalPages",
    "onChange",
    "size",
    "showPages",
    "maxVisible",
  ]);

  const pageList = () => buildPageList(local.page, local.totalPages, local.maxVisible ?? 5);

  return (
    <nav
      class={cls(
        "so-pagination",
        `so-pagination--${local.size ?? "md"}`,
        local.class,
      )}
      aria-label="Pagination"
      data-density={local.density}
      {...others}
    >
      <button
        type="button"
        class="so-pagination__button"
        disabled={local.page <= 1}
        onClick={() => local.onChange(local.page - 1)}
        aria-label="Previous page"
      >
        Prev
      </button>

      <Show when={local.showPages} fallback={
        <span class="so-pagination__info">
          {local.page} / {local.totalPages}
        </span>
      }>
        <For each={pageList()}>
          {(item) => (
            <Show when={item !== "ellipsis"} fallback={
              <span class="so-pagination__ellipsis" aria-hidden="true">…</span>
            }>
              <button
                type="button"
                class={cls(
                  "so-pagination__page",
                  local.page === item && "so-pagination__page--active",
                )}
                aria-label={`Page ${item}`}
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
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
