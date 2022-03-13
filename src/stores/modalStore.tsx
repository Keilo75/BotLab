import clsx from "clsx";
import React, { useMemo } from "react";
import create from "zustand";
import { ModalName, ModalData } from "../models/modals";

interface ContentProps {
  padding?: boolean;
}

const ModalContent: React.FC<ContentProps> = ({ children, padding }) => (
  <div className={clsx("modal-content", padding && "modal-content-padding")}>{children}</div>
);

const ModalFooter: React.FC = ({ children }) => <div className="modal-footer">{children}</div>;

export const ModalLayout: { Content: React.FC<ContentProps>; Footer: React.FC } = {
  Content: ModalContent,
  Footer: ModalFooter,
};

export interface Modal {
  name: ModalName;
  large?: boolean;
}

export interface IModalStore {
  currentModal: Modal | undefined;
  modals: Modal[];
  data: any;
  actions: {
    setCurrentModal: <T extends ModalName>(name: T, data?: ModalData[T]) => void;
    hideModal: () => void;

    addModal: (modal: Modal) => void;
    removeModal: (name: ModalName) => void;
  };
}

export const ModalStore = create<IModalStore>((set, get) => ({
  currentModal: undefined,
  modals: [],
  data: undefined,
  actions: {
    setCurrentModal: (name, data) => {
      const modal = get().modals.find((modal) => modal.name === name);
      if (modal) set({ currentModal: modal, data });
      else throw new Error("Cannot find modal " + name);
    },
    hideModal: () => {
      set({ currentModal: undefined, data: undefined });
    },
    addModal: (modal) => {
      set({ modals: [...get().modals, modal] });
    },
    removeModal: (name) => {
      set({ modals: get().modals.filter((modal) => modal.name !== name) });
    },
  },
}));

export const useModalData = <T extends ModalName>(): ModalData[T] => {
  const data = useMemo(() => ModalStore.getState().data, []);
  return data as ModalData[T];
};
