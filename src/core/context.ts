import { createContext, useContext } from "solid-js";
import { ja } from "date-fns/locale";
import type { DateFormatConfig } from "./types";

export interface SouiContextValue {
  dateFormat: DateFormatConfig;
}

const defaultContext: SouiContextValue = {
  dateFormat: {
    displayFormat: "yyyy/MM/dd",
    locale: ja,
  },
};

export const SouiContext = createContext<SouiContextValue>(defaultContext);

export function useSoui(): SouiContextValue {
  return useContext(SouiContext);
}
