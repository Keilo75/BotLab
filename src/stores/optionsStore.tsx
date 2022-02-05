import create from "zustand";
import { currentModal } from "../hooks/useModal";

export const defaultOptions = {
  general: {
    theme: 0,
  },
};

export type Options = typeof defaultOptions;

export interface OptionsStore {
  options: typeof defaultOptions;
  setGeneral(value: Options["general"]): void;
}

export const optionsStore = create<OptionsStore>((set) => ({
  options: defaultOptions,
  setGeneral: (value) => set((state) => ({ options: { ...state.options, general: value } })),
}));
