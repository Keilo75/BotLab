import clsx from "clsx";
import React, { useMemo } from "react";
import { InteractionType } from "src/models/interactions";
import create from "zustand";
import { Options } from "./OptionsStore";

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

export enum ModalName {
  OPTIONS = "options",
  CREATE_NEW_PROJECT = "create-new-project",
  ERROR = "error",
  ABOUT = "about",
  CONFIRMATION = "confirmation",
  RENAME_INTERACTION = "rename-interaction",
}

export interface Modal {
  name: ModalName;
  large?: boolean;
}

export interface ModalData extends Record<ModalName, any> {
  error: string;
  confirmation: {
    title: string;
    text: string;
    buttonText: string;
    confirmationOption: keyof Options["editor"];
    handleConfirm: () => void;
  };
  "rename-interaction": {
    id: string;
    name: string;
    type: InteractionType;
    parent: string;
  };
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
