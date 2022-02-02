import create from "zustand";
import { currentModal } from "./hooks/useModal";

export interface AppStore {
  currentModal: currentModal | undefined;
  setCurrentModal(modal: currentModal | undefined): void;
}

export const appState = create<AppStore>((set) => ({
  currentModal: undefined,
  setCurrentModal: (modal) => {
    set(() => ({
      currentModal: modal,
    }));
  },
}));
