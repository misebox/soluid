import { createMemo, createSignal } from "solid-js";
import type { Accessor } from "solid-js";

export interface PaginationOptions {
  /** Total number of items */
  totalItems: Accessor<number>;
  /** Number of items per page (default: 10) */
  pageSize?: Accessor<number>;
  /** Initial page (1-based, default: 1) */
  initialPage?: number;
}

export interface PaginationReturn {
  page: Accessor<number>;
  totalPages: Accessor<number>;
  setPage: (page: number) => void;
  next: () => void;
  prev: () => void;
  canNext: Accessor<boolean>;
  canPrev: Accessor<boolean>;
  /** 0-based start index for current page */
  startIndex: Accessor<number>;
  /** 0-based exclusive end index for current page */
  endIndex: Accessor<number>;
}

export function createPagination(options: PaginationOptions): PaginationReturn {
  const pageSize = options.pageSize ?? (() => 10);
  const [page, setPageRaw] = createSignal(options.initialPage ?? 1);

  const totalPages = createMemo(() => {
    const total = options.totalItems();
    const size = pageSize();
    if (total <= 0 || size <= 0) return 1;
    return Math.ceil(total / size);
  });

  function clampPage(p: number): number {
    return Math.max(1, Math.min(p, totalPages()));
  }

  function setPage(p: number): void {
    setPageRaw(clampPage(p));
  }

  function next(): void {
    setPage(page() + 1);
  }

  function prev(): void {
    setPage(page() - 1);
  }

  const canNext = createMemo(() => page() < totalPages());
  const canPrev = createMemo(() => page() > 1);

  const startIndex = createMemo(() => (page() - 1) * pageSize());
  const endIndex = createMemo(() => Math.min(startIndex() + pageSize(), options.totalItems()));

  return {
    page,
    totalPages,
    setPage,
    next,
    prev,
    canNext,
    canPrev,
    startIndex,
    endIndex,
  };
}
