import { createContext, useContext } from "solid-js";

export interface RadioGroupContextValue {
  name: string;
  value: () => string | undefined;
  onChange: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue>();

export function useRadioGroup(): RadioGroupContextValue | undefined {
  return useContext(RadioGroupContext);
}
