import { createContext, useContext } from "solid-js";

export interface CheckboxGroupContextValue {
  value: () => string[];
  onChange: (itemValue: string, checked: boolean) => void;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue>();

export function useCheckboxGroup(): CheckboxGroupContextValue | undefined {
  return useContext(CheckboxGroupContext);
}
