import create from "zustand";

export type InfoBarType = "success" | "loading" | "error";

export interface IInfoStore {
  infoMessage: {
    text: string | undefined;
    type: InfoBarType | undefined;
  };
  setInfoMessage: (text: string, type: InfoBarType) => void;
  clearInfoMessage: () => void;
  title: string;
  dirty: boolean;
  setTitle: (title: string, hideAppName?: boolean) => void;
  setDirty: (dirty: boolean) => void;
}

export const InfoStore = create<IInfoStore>((set) => ({
  infoMessage: {
    text: undefined,
    type: undefined,
  },
  setInfoMessage: (text, type) => set({ infoMessage: { text, type } }),
  clearInfoMessage: () => set({ infoMessage: { text: undefined, type: undefined } }),
  title: "",
  setTitle: (title, showAppName) => set({ title: `${title} ${!showAppName ? "- BotLab" : ""}` }),
  dirty: false,
  setDirty: (dirty) => set({ dirty }),
}));
