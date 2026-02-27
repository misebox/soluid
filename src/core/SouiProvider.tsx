import { splitProps, createEffect, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import { SouiContext } from "./context";
import { createTheme } from "./theme";
import { ja } from "date-fns/locale";
import type { ThemeConfig, Density } from "./types";

export interface SouiProviderProps {
  config?: ThemeConfig;
  children: JSX.Element;
}

export function SouiProvider(props: SouiProviderProps) {
  const [local, others] = splitProps(props, ["config", "children"]);

  let rootRef: HTMLDivElement | undefined;

  createEffect(() => {
    const el = rootRef;
    if (!el) return;

    const config = local.config;
    const density: Density = config?.density ?? "normal";
    const theme = config?.theme ?? "light";

    el.setAttribute("data-density", density);
    el.setAttribute("data-theme", theme);
    el.setAttribute("data-soui", "");

    // Inject custom color CSS if provided
    if (config?.colors && config.colors.length > 0) {
      const { cssText } = createTheme(config.colors);
      if (cssText) {
        const style = document.createElement("style");
        style.setAttribute("data-soui-theme", "");
        style.textContent = cssText;
        document.head.appendChild(style);

        onCleanup(() => style.remove());
      }
    }
  });

  const contextValue = () => ({
    dateFormat: {
      displayFormat: local.config?.dateFormat?.displayFormat ?? "yyyy/MM/dd",
      locale: local.config?.dateFormat?.locale ?? ja,
    },
  });

  return (
    <SouiContext.Provider value={contextValue()}>
      <div ref={rootRef} {...others}>
        {local.children}
      </div>
    </SouiContext.Provider>
  );
}
