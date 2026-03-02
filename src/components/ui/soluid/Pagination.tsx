import { splitProps } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface PaginationProps extends CommonProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: "sm" | "md";
}

export function Pagination(props: PaginationProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "page",
    "totalPages",
    "onChange",
    "size",
  ]);

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
      <span class="so-pagination__info">
        {local.page} / {local.totalPages}
      </span>
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
