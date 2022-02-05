import create from "zustand";
import { currentModal } from "../hooks/useModal";

export interface ModalStore {
  currentModal: currentModal | undefined;
  setCurrentModal(modal: currentModal | undefined): void;
}

export const modalStore = create<ModalStore>((set) => ({
  currentModal: undefined,
  setCurrentModal: (modal) => set({ currentModal: modal }),
}));
