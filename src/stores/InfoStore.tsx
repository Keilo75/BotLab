import create from "zustand";

export type InfoBarType = "success" | "loading" | "error";

export interface TitleMessage {
  title?: string;
  dirty?: boolean;
}

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
    setTitlebar: (message: TitleMessage, hideAppName?: boolean) => void;
  };
}

export const InfoStore = create<IInfoStore>((set, get) => ({
  infoMessage: {
    text: undefined,
    type: undefined,
  },
  title: "",
  dirty: false,
  actions: {
    setInfoMessage: (text, type) => set({ infoMessage: { text, type } }),
    clearInfoMessage: () => set({ infoMessage: { text: undefined, type: undefined } }),
    setTitlebar: (message, showAppName) => {
      const newTitlebar = {
        title:
          message.title !== undefined
            ? `${message.title} ${!showAppName ? "- BotLab" : ""}`
            : get().title,
        dirty: message.dirty !== undefined ? message.dirty : get().dirty,
      };

      set(newTitlebar);
    },
  },
}));
