import { createContext, useContext } from "solid-js";

export interface FormFieldContextValue {
  id: string;
  errorId: string;
  /** Undefined while there is no hint to point at. */
  hintId: string | undefined;
  hasError: boolean;
}

export const FormFieldContext = createContext<FormFieldContextValue>();

export function useFormField(): FormFieldContextValue | undefined {
  return useContext(FormFieldContext);
}
