import create, { SetState } from "zustand";

export const defaultOptions = {
  general: {
    theme: 0,
  },
  experimental: {
    emptyFolderOnProjectCreation: false,
  },
};

export type Options = typeof defaultOptions;

export interface OptionsStore {
  options: Options | undefined;
  setOptions(value: Options): void;
  setGeneral(value: Options["general"]): void;
  setExperimental(value: Options["experimental"]): void;
}

export const optionsStore = create<OptionsStore>((set, get) => {
  const setCategory = <T extends keyof Options>(category: T, value: Options[T]) => {
    set((state) => {
      if (state.options) return { options: { ...state.options, [category]: value } };

      return { options: undefined };
    });
  };

  return {
    options: undefined,
    setOptions: (value) => set({ options: value }),
    setGeneral: (value) => setCategory("general", value),
    setExperimental: (value) => setCategory("experimental", value),
  };
});
