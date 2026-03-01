import { createMemo, For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./Table.css";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  render?: (value: unknown, row: T) => JSX.Element;
}

export interface TableProps<T> extends CommonProps {
  columns: Column<T>[];
  data: T[];
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string, direction: "asc" | "desc") => void;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelect?: (keys: Set<string>) => void;
  rowKey?: (row: T) => string;
}

export function Table<T extends Record<string, unknown>>(
  props: TableProps<T>,
) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "columns",
    "data",
    "sortKey",
    "sortDirection",
    "onSort",
    "selectable",
    "selectedKeys",
    "onSelect",
    "rowKey",
  ]);

  function getRowKey(row: T, index: number): string {
    if (local.rowKey) return local.rowKey(row);
    return String(index);
  }

  function handleSort(key: string): void {
    if (!local.onSort) return;
    const nextDirection = local.sortKey === key && local.sortDirection === "asc" ? "desc" : "asc";
    local.onSort(key, nextDirection);
  }

  const allSelected = createMemo(() => {
    if (!local.selectable || !local.selectedKeys || local.data.length === 0) {
      return false;
    }
    return local.data.every(
      (row, i) => local.selectedKeys?.has(getRowKey(row, i)),
    );
  });

  function handleSelectAll(): void {
    if (!local.onSelect) return;
    if (allSelected()) {
      local.onSelect(new Set());
    } else {
      const keys = new Set(local.data.map((row, i) => getRowKey(row, i)));
      local.onSelect(keys);
    }
  }

  function handleSelectRow(key: string): void {
    if (!local.onSelect) return;
    const next = new Set(local.selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    local.onSelect(next);
  }

  return (
    <div
      class={cls("so-table-wrapper", local.class)}
      data-density={local.density}
      {...others}
    >
      <table class="so-table" role="table">
        <thead>
          <tr class="so-table__row so-table__row--header">
            <Show when={local.selectable}>
              <th class="so-table__cell so-table__cell--checkbox">
                <input
                  type="checkbox"
                  checked={allSelected()}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            </Show>
            <For each={local.columns}>
              {(col) => (
                <th
                  class={cls(
                    "so-table__cell",
                    "so-table__header",
                    col.align && `so-table__cell--${col.align}`,
                  )}
                  style={{ width: col.width }}
                  aria-sort={local.sortKey === col.key
                    ? local.sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined}
                >
                  <Show
                    when={col.sortable}
                    fallback={col.header}
                  >
                    <button
                      type="button"
                      class="so-table__sort-button"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      <span
                        class={cls(
                          "so-table__sort-icon",
                          local.sortKey === col.key
                            && `so-table__sort-icon--${local.sortDirection}`,
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </Show>
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={local.data}>
            {(row, i) => {
              const key = () => getRowKey(row, i());
              return (
                <tr
                  class={cls(
                    "so-table__row",
                    local.selectedKeys?.has(key())
                      && "so-table__row--selected",
                  )}
                >
                  <Show when={local.selectable}>
                    <td class="so-table__cell so-table__cell--checkbox">
                      <input
                        type="checkbox"
                        checked={local.selectedKeys?.has(key()) ?? false}
                        onChange={() => handleSelectRow(key())}
                        aria-label={`Select row ${key()}`}
                      />
                    </td>
                  </Show>
                  <For each={local.columns}>
                    {(col) => (
                      <td
                        class={cls(
                          "so-table__cell",
                          col.align && `so-table__cell--${col.align}`,
                        )}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : (row[col.key] as JSX.Element)}
                      </td>
                    )}
                  </For>
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
    </div>
  );
}
