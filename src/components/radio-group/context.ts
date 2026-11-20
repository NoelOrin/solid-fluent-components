import { createContext, useContext } from "solid-js";

export type RadioMoveDirection = "next" | "prev" | "first" | "last";

export type RadioGroupContextValue = {
  value: () => string | undefined;
  name: () => string | undefined;
  disabled: () => boolean;
  setValue: (value: string) => void;
  register: (value: string, el: HTMLInputElement) => void;
  unregister: (value: string) => void;
  move: (fromValue: string, direction: RadioMoveDirection) => void;
  isTabbable: (value: string) => boolean;
};

export const RadioGroupContext = createContext<RadioGroupContextValue>();

export function useRadioGroupContext() {
  return useContext(RadioGroupContext);
}
