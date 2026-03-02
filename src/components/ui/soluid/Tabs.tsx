import { createContext, Show, splitProps, useContext } from "solid-js";
import type { Accessor, JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

interface TabsContextValue {
  value: Accessor<string>;
  onChange: (value: string) => void;
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
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "value",
    "onChange",
    "children",
  ]);

  const context: TabsContextValue = {
    value: () => local.value,
    onChange: (v: string) => local.onChange(v),
  };

  return (
    <TabsContext.Provider value={context}>
      <div
        class={cls("so-tabs", local.class)}
        data-density={local.density}
        {...others}
      >
        {local.children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabList(props: TabListProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cls("so-tab-list", local.class)}
      role="tablist"
      {...others}
    >
      {local.children}
    </div>
  );
}

export function Tab(props: TabProps) {
  const [local, others] = splitProps(props, [
    "value",
    "disabled",
    "class",
    "children",
  ]);

  const ctx = useTabsContext();

  return (
    <button
      type="button"
      class={cls(
        "so-tab",
        ctx.value() === local.value && "so-tab--active",
        local.class,
      )}
      role="tab"
      aria-selected={ctx.value() === local.value}
      disabled={local.disabled}
      onClick={() => {
        if (!local.disabled) {
          ctx.onChange(local.value);
        }
      }}
      tabIndex={ctx.value() === local.value ? 0 : -1}
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
        {...others}
      >
        {local.children}
      </div>
    </Show>
  );
}
