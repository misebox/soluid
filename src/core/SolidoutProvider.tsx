import { createEffect, onCleanup, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { SolidoutContext } from "./context";
import { createTheme } from "./theme";
import type { Density, ThemeConfig } from "./types";

export interface SolidoutProviderProps {
  config?: ThemeConfig;
  children: JSX.Element;
}

export function SolidoutProvider(props: SolidoutProviderProps) {
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
    el.setAttribute("data-so", "");

    // Inject custom color CSS if provided
    if (config?.colors && config.colors.length > 0) {
      const { cssText } = createTheme(config.colors);
      if (cssText) {
        const style = document.createElement("style");
        style.setAttribute("data-so-theme", "");
        style.textContent = cssText;
        document.head.appendChild(style);

        onCleanup(() => style.remove());
      }
    }
  });

  const contextValue = () => ({
    dateFormat: {
      displayFormat: local.config?.dateFormat?.displayFormat ?? "yyyy/MM/dd",
      locale: local.config?.dateFormat?.locale,
    },
  });

  return (
    <SolidoutContext.Provider value={contextValue()}>
      <div ref={rootRef} {...others}>
        {local.children}
      </div>
    </SolidoutContext.Provider>
  );
}
