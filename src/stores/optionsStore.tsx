import create from "zustand";

export interface Options {
  "general.theme": "dark" | "light";
  "editor.confirmInteractionDeletion": boolean;
  "developer.emptyFolderOnProjectCreation": boolean;
}

export const defaultOptions: Options = {
  "general.theme": "dark",
  "editor.confirmInteractionDeletion": true,
  "developer.emptyFolderOnProjectCreation": false,
};

export interface IOptionsStore {
  options: Options | undefined;
  actions: {
    setOptions(value: Options): void;
  };
}

export const OptionsStore = create<IOptionsStore>((set) => ({
  options: undefined,
  actions: {
    setOptions: (value) => set({ options: value }),
  },
}));

export const getOption = <C extends keyof Options>(category: C): Options[C] => {
  const options = OptionsStore.getState().options as Options;

  return options[category];
};
