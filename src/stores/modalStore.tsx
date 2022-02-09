import { useModalOptions } from "src/hooks/useModal";
import { ModalNames } from "src/models/ModalNames";
import create from "zustand";

export interface Modal extends useModalOptions {
  hide(): void;
  error?: string;
}

export interface ModalStore {
  currentModal: Modal | undefined;
  setCurrentModal(name: ModalNames | undefined): void;
  modals: Modal[];
  addModal(modal: Modal): void;
  removeModal(name: ModalNames): void;
  openErrorModal(error: string): void;
}

export const modalStore = create<ModalStore>((set, get) => ({
  currentModal: undefined,
  setCurrentModal: (name) => {
    if (name === undefined) return set({ currentModal: undefined });

    const modal = get().modals.find((modal) => modal.name === name);
    if (modal) set({ currentModal: modal });
    else throw new Error("Cannot find modal " + name);
  },
  modals: [],
  addModal: (modal) => {
    set({ modals: [...get().modals, modal] });
  },
  removeModal: (name) => {
    set({ modals: get().modals.filter((modal) => modal.name !== name) });
  },
  openErrorModal: (error) => {
    const errorModal = get().modals.find((modal) => modal.name === ModalNames.ERROR);

    if (errorModal) {
      errorModal.error = error;
      set({ currentModal: errorModal });
    }
  },
}));
