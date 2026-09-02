import { createContext, createSignal, createUniqueId, onCleanup, Show, splitProps, useContext } from "solid-js";
import type { Accessor, JSX } from "solid-js";
import { isServer } from "solid-js/web";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

interface TabRecord {
  value: () => string;
  disabled: () => boolean | undefined;
}

interface TabsContextValue {
  value: Accessor<string>;
  onChange: (value: string) => void;
  baseId: string;
  register: (tab: TabRecord) => void;
  /** Value of the one tab the Tab key lands on */
  tabStop: Accessor<string | undefined>;
}

const TabsContext = createContext<TabsContextValue>();

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tab components must be used within <Tabs>");
  }
  return ctx;
}

export interface TabsProps extends CommonProps {
  value: string;
  onChange: (value: string) => void;
  children: JSX.Element;
}

export interface TabListProps {
  class?: string;
  children: JSX.Element;
}

export interface TabProps {
  value: string;
  disabled?: boolean;
  class?: string;
  children: JSX.Element;
}

export interface TabPanelProps {
  value: string;
  class?: string;
  children: JSX.Element;
}

export function Tabs(props: TabsProps) {
  const [local, others] = splitProps(props, ["class", "density", "value", "onChange", "children"]);

  const baseId = `so-tabs-${createUniqueId()}`;

  const [tabs, setTabs] = createSignal<TabRecord[]>([]);

  // The selected tab, unless it cannot take focus; then the first enabled one,
  // so the list stays reachable by keyboard. Not a memo: on the server a memo
  // is evaluated once, before any Tab has registered, so every tab would
  // render tabindex="-1". Tabs register one at a time there, so a tab rendered
  // before the selected one cannot see it yet; assume the selected value exists.
  const tabStop = () => {
    const enabled = tabs().filter((tab) => !tab.disabled());
    const selected = enabled.find((tab) => tab.value() === local.value);
    if (selected) return selected.value();
    return isServer ? local.value : enabled[0]?.value();
  };

  const context: TabsContextValue = {
    value: () => local.value,
    onChange: (v: string) => local.onChange(v),
    baseId,
    register(tab) {
      setTabs((list) => [...list, tab]);
      onCleanup(() => setTabs((list) => list.filter((it) => it !== tab)));
    },
    tabStop,
  };

  return (
    <TabsContext.Provider value={context}>
      <div class={cls("so-tabs", local.class)} data-density={local.density} {...others}>
        {local.children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabList(props: TabListProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  function handleKeyDown(e: KeyboardEvent) {
    const target = e.currentTarget as HTMLElement;
    const tabs = Array.from(target.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    if (tabs.length === 0) return;

    const current = document.activeElement as HTMLElement;
    const idx = tabs.indexOf(current as HTMLButtonElement);
    if (idx === -1) return;

    let next: number | undefined;
    if (e.key === "ArrowRight") {
      next = (idx + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      next = (idx - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = tabs.length - 1;
    }

    if (next != null) {
      e.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    }
  }

  return (
    <div
      class={cls("so-tab-list", local.class)}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      {...others}
    >
      {local.children}
    </div>
  );
}

export function Tab(props: TabProps) {
  const [local, others] = splitProps(props, ["value", "disabled", "class", "children"]);

  const ctx = useTabsContext();
  ctx.register({ value: () => local.value, disabled: () => local.disabled });

  return (
    <button
      type="button"
      class={cls("so-tab", ctx.value() === local.value && "so-tab--active", local.class)}
      role="tab"
      id={`${ctx.baseId}-tab-${local.value}`}
      aria-selected={ctx.value() === local.value}
      aria-controls={`${ctx.baseId}-panel-${local.value}`}
      disabled={local.disabled}
      onClick={() => {
        if (!local.disabled) {
          ctx.onChange(local.value);
        }
      }}
      tabIndex={ctx.tabStop() === local.value ? 0 : -1}
      {...others}
    >
      {local.children}
    </button>
  );
}

export function TabPanel(props: TabPanelProps) {
  const [local, others] = splitProps(props, ["value", "class", "children"]);
  const ctx = useTabsContext();

  return (
    <Show when={ctx.value() === local.value}>
      <div
        class={cls("so-tab-panel", local.class)}
        role="tabpanel"
        id={`${ctx.baseId}-panel-${local.value}`}
        aria-labelledby={`${ctx.baseId}-tab-${local.value}`}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  );
}
