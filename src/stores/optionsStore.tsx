import create, { SetState } from "zustand";

export const defaultOptions = {
  general: {
    theme: 0,
  },
  experimental: {
    pruneFolderOnProjectCreation: false,
  },
};

export type Options = typeof defaultOptions;

export interface OptionsStore {
  options: Options;
  setOptions(value: Options): void;
  setGeneral(value: Options["general"]): void;
  setExperimental(value: Options["experimental"]): void;
}

export const optionsStore = create<OptionsStore>((set) => {
  const setCategory = <T extends keyof Options>(category: T, value: Options[T]) => {
    set((state) => ({ options: { ...state.options, [category]: value } }));
  };

  return {
    options: defaultOptions,
    setOptions: (value) => set({ options: value }),
    setGeneral: (value) => setCategory("general", value),
    setExperimental: (value) => setCategory("experimental", value),
  };
});
