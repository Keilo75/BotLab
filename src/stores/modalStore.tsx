import clsx from "clsx";
import { useMemo } from "react";
import create from "zustand";

interface ContentProps {
  padding?: boolean;
}

export const ModalLayout: { Content: React.FC<ContentProps>; Footer: React.FC } = {
  Content: ({ children, padding }) => (
    <div className={clsx("modal-content", padding && "modal-content-padding")}>{children}</div>
  ),
  Footer: ({ children }) => <div className="modal-footer">{children}</div>,
};

export enum ModalName {
  OPTIONS = "options",
  CREATE_NEW_PROJECT = "create-new-project",
  ERROR = "error",
  ABOUT = "about",
}

export interface Modal {
  name: ModalName;
  large?: boolean;
}

export interface ModalData extends Record<ModalName, any> {
  error: string;
}

export interface IModalStore {
  currentModal: Modal | undefined;
  setCurrentModal: <T extends ModalName>(name: T, data?: ModalData[T]) => void;
  hideModal: () => void;
  modals: Modal[];
  addModal: (modal: Modal) => void;
  removeModal: (name: ModalName) => void;
  data: any;
}

export const ModalStore = create<IModalStore>((set, get) => ({
  currentModal: undefined,
  setCurrentModal: (name, data) => {
    const modal = get().modals.find((modal) => modal.name === name);
    if (modal) set({ currentModal: modal, data });
    else throw new Error("Cannot find modal " + name);
  },
  hideModal: () => {
    set({ currentModal: undefined, data: undefined });
  },
  modals: [],
  addModal: (modal) => {
    set({ modals: [...get().modals, modal] });
  },
  removeModal: (name) => {
    set({ modals: get().modals.filter((modal) => modal.name !== name) });
  },
  data: undefined,
}));

export const useModalData = <T extends ModalName>(name: T): ModalData[T] => {
  const data = useMemo(() => ModalStore.getState().data, []);
  return data as ModalData[T];
};
