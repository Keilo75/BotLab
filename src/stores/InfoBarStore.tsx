import create from "zustand";

export type InfoBarType = "success" | "loading" | "error";

export interface IInfoBarStore {
  text: string | undefined;
  type: InfoBarType | undefined;
  setInfoMessage: (text: string, type: InfoBarType) => void;
  clearInfoMessage: () => void;
}

export const InfoBarStore = create<IInfoBarStore>((set) => ({
  text: undefined,
  type: undefined,
  setInfoMessage: (text, type) => set({ text, type }),
  clearInfoMessage: () => set({ text: undefined, type: undefined }),
}));
