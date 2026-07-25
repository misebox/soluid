import { createMemo, For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeProps extends CommonProps {
  nodes: TreeNode[];
  /** Ids of the expanded branches */
  expanded: string[];
  onExpandedChange: (expanded: string[]) => void;
  selected?: string;
  onSelect?: (id: string) => void;
  /** Accessible label for the tree */
  label?: string;
}

/** A node paired with the depth it renders at. */
interface FlatNode {
  node: TreeNode;
  level: number;
}

function flatten(nodes: TreeNode[], expanded: string[], level = 1): FlatNode[] {
  return nodes.flatMap((node) => {
    const self = { node, level };
    const open = node.children?.length && expanded.includes(node.id);
    return open ? [self, ...flatten(node.children ?? [], expanded, level + 1)] : [self];
  });
}

// onSelect is omitted because TreeProps redefines it: the DOM select event
// handler would otherwise be intersected with the node-id callback.
export function Tree(props: TreeProps & Omit<JSX.HTMLAttributes<HTMLUListElement>, "onSelect">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "nodes",
    "expanded",
    "onExpandedChange",
    "selected",
    "onSelect",
    "label",
  ]);

  /** Only the rows currently on screen take part in arrow-key navigation. */
  const visible = createMemo(() => flatten(local.nodes, local.expanded));

  const isExpanded = (node: TreeNode) => local.expanded.includes(node.id);
  const isBranch = (node: TreeNode) => (node.children?.length ?? 0) > 0;

  /** First enabled row, so the tree always has exactly one tab stop. */
  const tabStop = createMemo(() => {
    const rows = visible();
    const chosen = rows.find((row) => row.node.id === local.selected && !row.node.disabled);
    return (chosen ?? rows.find((row) => !row.node.disabled))?.node.id;
  });

  function setExpanded(id: string, open: boolean): void {
    const current = local.expanded;
    if (open === current.includes(id)) return;
    local.onExpandedChange(open ? [...current, id] : current.filter((it) => it !== id));
  }

  function focusRow(index: number): void {
    const rows = visible();
    const target = rows[index];
    if (!target) return;
    document.getElementById(rowId(target.node.id))?.focus();
  }

  function rowId(id: string): string {
    return `so-tree-item-${id}`;
  }

  function handleKeyDown(node: TreeNode, e: KeyboardEvent): void {
    const rows = visible();
    const index = rows.findIndex((row) => row.node.id === node.id);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusRow(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusRow(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (isBranch(node) && !isExpanded(node)) setExpanded(node.id, true);
      else if (isBranch(node)) focusRow(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (isBranch(node) && isExpanded(node)) {
        setExpanded(node.id, false);
      } else {
        // Walk back to the nearest shallower row: the parent.
        const level = rows[index]?.level ?? 1;
        for (let i = index - 1; i >= 0; i--) {
          if (rows[i].level < level) {
            focusRow(i);
            break;
          }
        }
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      focusRow(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusRow(rows.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(node);
    }
  }

  function activate(node: TreeNode): void {
    if (node.disabled) return;
    if (isBranch(node)) setExpanded(node.id, !isExpanded(node));
    local.onSelect?.(node.id);
  }

  return (
    <ul
      class={cls("so-tree", local.class)}
      role="tree"
      aria-label={local.label}
      data-density={local.density}
      {...others}
    >
      <For each={visible()}>
        {(row) => (
          <li
            class="so-tree__item"
            role="treeitem"
            aria-level={row.level}
            aria-expanded={isBranch(row.node) ? isExpanded(row.node) : undefined}
            aria-selected={local.selected === row.node.id}
            aria-disabled={row.node.disabled || undefined}
          >
            <button
              type="button"
              id={rowId(row.node.id)}
              class={cls(
                "so-tree__row",
                local.selected === row.node.id && "so-tree__row--selected",
                row.node.disabled && "so-tree__row--disabled",
              )}
              style={{ "padding-left": `calc(var(--so-space-2) * ${row.level})` }}
              disabled={row.node.disabled}
              tabIndex={tabStop() === row.node.id ? 0 : -1}
              onClick={() => activate(row.node)}
              onKeyDown={(e) => handleKeyDown(row.node, e)}
            >
              <Show when={isBranch(row.node)} fallback={<span class="so-tree__spacer" aria-hidden="true" />}>
                <svg
                  class={cls("so-tree__chevron", isExpanded(row.node) && "so-tree__chevron--open")}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </Show>
              <span class="so-tree__label">{row.node.label}</span>
            </button>
          </li>
        )}
      </For>
    </ul>
  );
}
