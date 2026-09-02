import { createMemo, createUniqueId, For, Show, splitProps } from "solid-js";
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

/** The rows on screen in order, with the depth each renders at. */
interface FlatTree {
  rows: TreeNode[];
  levels: Map<TreeNode, number>;
}

function flatten(nodes: TreeNode[], expanded: string[]): FlatTree {
  const rows: TreeNode[] = [];
  const levels = new Map<TreeNode, number>();
  const walk = (list: TreeNode[], level: number): void => {
    for (const node of list) {
      rows.push(node);
      levels.set(node, level);
      if (node.children?.length && expanded.includes(node.id)) walk(node.children, level + 1);
    }
  };
  walk(nodes, 1);
  return { rows, levels };
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

  // Rows are the caller's node objects, so <For> keeps a row's DOM, and the
  // focus in it, when the rows around it appear or disappear.
  const flat = createMemo(() => flatten(local.nodes, local.expanded));
  /** Only the rows currently on screen take part in arrow-key navigation. */
  const visible = () => flat().rows;
  const levelOf = (node: TreeNode) => flat().levels.get(node) ?? 1;

  const idPrefix = `so-tree-${createUniqueId()}-`;

  const isExpanded = (node: TreeNode) => local.expanded.includes(node.id);
  const isBranch = (node: TreeNode) => (node.children?.length ?? 0) > 0;

  /** First enabled row, so the tree always has exactly one tab stop. */
  const tabStop = createMemo(() => {
    const rows = visible();
    const chosen = rows.find((node) => node.id === local.selected && !node.disabled);
    return (chosen ?? rows.find((node) => !node.disabled))?.id;
  });

  function setExpanded(id: string, open: boolean): void {
    const current = local.expanded;
    if (open === current.includes(id)) return;
    local.onExpandedChange(open ? [...current, id] : current.filter((it) => it !== id));
  }

  /** Focuses the nearest enabled row from `index`, walking by `step`. */
  function focusRow(index: number, step: 1 | -1): void {
    const rows = visible();
    for (let i = index; i >= 0 && i < rows.length; i += step) {
      if (rows[i].disabled) continue;
      document.getElementById(rowId(rows[i].id))?.focus();
      return;
    }
  }

  function rowId(id: string): string {
    return idPrefix + id;
  }

  function handleKeyDown(node: TreeNode, e: KeyboardEvent): void {
    const rows = visible();
    const index = rows.indexOf(node);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusRow(index + 1, 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusRow(index - 1, -1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (isBranch(node) && !isExpanded(node)) setExpanded(node.id, true);
      else if (isBranch(node)) focusRow(index + 1, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (isBranch(node) && isExpanded(node)) {
        setExpanded(node.id, false);
      } else {
        // Walk back to the nearest shallower row: the parent.
        const level = levelOf(node);
        for (let i = index - 1; i >= 0; i--) {
          if (levelOf(rows[i]) < level) {
            focusRow(i, -1);
            break;
          }
        }
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      focusRow(0, 1);
    } else if (e.key === "End") {
      e.preventDefault();
      focusRow(rows.length - 1, -1);
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
        {(node) => (
          <li
            class="so-tree__item"
            role="treeitem"
            aria-level={levelOf(node)}
            aria-expanded={isBranch(node) ? isExpanded(node) : undefined}
            aria-selected={local.selected === node.id}
            aria-disabled={node.disabled || undefined}
          >
            <button
              type="button"
              id={rowId(node.id)}
              class={cls(
                "so-tree__row",
                local.selected === node.id && "so-tree__row--selected",
                node.disabled && "so-tree__row--disabled",
              )}
              style={{ "padding-left": `calc(var(--so-space-2) * ${levelOf(node)})` }}
              disabled={node.disabled}
              tabIndex={tabStop() === node.id ? 0 : -1}
              onClick={() => activate(node)}
              onKeyDown={(e) => handleKeyDown(node, e)}
            >
              <Show when={isBranch(node)} fallback={<span class="so-tree__spacer" aria-hidden="true" />}>
                <svg
                  class={cls("so-tree__chevron", isExpanded(node) && "so-tree__chevron--open")}
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
              <span class="so-tree__label">{node.label}</span>
            </button>
          </li>
        )}
      </For>
    </ul>
  );
}
