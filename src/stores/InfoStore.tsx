import create from "zustand";

export type InfoBarType = "success" | "loading" | "error";

export interface IInfoStore {
  infoMessage: {
    text: string | undefined;
    type: InfoBarType | undefined;
  };
  title: string;
  dirty: boolean;
  actions: {
    setInfoMessage: (text: string, type: InfoBarType) => void;
    clearInfoMessage: () => void;
    setTitle: (title: string, hideAppName?: boolean) => void;
    setDirty: (dirty: boolean) => void;
  };
}

export const InfoStore = create<IInfoStore>((set) => ({
  infoMessage: {
    text: undefined,
    type: undefined,
  },
  title: "",
  dirty: false,
  actions: {
    setInfoMessage: (text, type) => set({ infoMessage: { text, type } }),
    clearInfoMessage: () => set({ infoMessage: { text: undefined, type: undefined } }),
    setTitle: (title, showAppName) => set({ title: `${title} ${!showAppName ? "- BotLab" : ""}` }),
    setDirty: (dirty) => set({ dirty }),
  },
}));
