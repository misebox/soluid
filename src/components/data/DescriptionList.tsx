import { For, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./DescriptionList.css";

export interface DescriptionListProps extends CommonProps {
  items: Array<{ term: string; description: JSX.Element }>;
  columns?: 1 | 2;
}

export function DescriptionList(props: DescriptionListProps) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "items",
    "columns",
  ]);

  return (
    <dl
      class={cls(
        "so-description-list",
        (local.columns ?? 1) === 2 && "so-description-list--2col",
        local.class,
      )}
      data-density={local.density}
      {...others}
    >
      <For each={local.items}>
        {(item) => (
          <>
            <dt class="so-description-list__term">{item.term}</dt>
            <dd class="so-description-list__detail">{item.description}</dd>
          </>
        )}
      </For>
    </dl>
  );
}
