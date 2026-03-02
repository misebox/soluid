import { createContext, useContext } from "solid-js";

export interface FormFieldContextValue {
  id: string;
  errorId: string;
  hintId: string;
  hasError: boolean;
}

export const FormFieldContext = createContext<FormFieldContextValue>();

export function useFormField(): FormFieldContextValue | undefined {
  return useContext(FormFieldContext);
}
