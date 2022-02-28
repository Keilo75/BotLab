import create from "zustand";

export const defaultOptions = {
  general: {
    theme: 0,
  },
  editor: { confirmInteractionDeletion: true },
  experimental: {
    emptyFolderOnProjectCreation: false,
  },
};

export type Options = typeof defaultOptions;

export interface IOptionsStore {
  options: Options | undefined;

  setOptions(value: Options): void;
  setGeneral: (value: Options["general"]) => void;
  setEditor: (value: Options["editor"]) => void;
  setExperimental: (value: Options["experimental"]) => void;
}

export const OptionsStore = create<IOptionsStore>((set, get) => {
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
    setEditor: (value) => setCategory("editor", value),
    setExperimental: (value) => setCategory("experimental", value),
  };
});

export const getOption = <C extends keyof Options, O extends keyof Options[C]>(
  category: C,
  option: O
): Options[C][O] => {
  const options = OptionsStore.getState().options as Options;

  return options[category][option];
};
