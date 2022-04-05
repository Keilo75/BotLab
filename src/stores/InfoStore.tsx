import { ValidationErrorScope, ValidationErrorScopeType } from "src/lib/validater";
import create from "zustand";

export type InfoBarStatus = "success" | "loading" | "error";

export interface TitleMessage {
  title?: string;
  dirty?: boolean;
}

export interface IInfoStore {
  infoMessage: {
    text: string | undefined;
    status: InfoBarStatus | undefined;
  };
  title: string;
  dirty: boolean;
  stacktrace: ValidationErrorScope[];
  actions: {
    setInfoMessage: (text: string, status: InfoBarStatus) => void;
    clearInfoMessage: () => void;
    setTitlebar: (message: TitleMessage, hideAppName?: boolean) => void;
    setStacktrace: (stacktrace: ValidationErrorScope[]) => void;
    removeErrorScope: (type: ValidationErrorScopeType) => void;
  };
}

export const InfoStore = create<IInfoStore>((set, get) => ({
  infoMessage: {
    text: undefined,
    status: undefined,
  },
  title: "",
  dirty: false,
  stacktrace: [],
  actions: {
    setInfoMessage: (text, status) => set({ infoMessage: { text, status } }),
    clearInfoMessage: () => set({ infoMessage: { text: undefined, status: undefined } }),
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
    setStacktrace: (stacktrace) => set({ stacktrace }),
    removeErrorScope: (type) =>
      set({ stacktrace: get().stacktrace.filter((scope) => scope.type !== type) }),
  },
}));
