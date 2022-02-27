import clsx from "clsx";
import { useMemo } from "react";
import { InteractionType } from "src/models/project";
import create from "zustand";
import { Options } from "./OptionsStore";

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
    textBased: boolean;
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

export const useModalData = <T extends ModalName>(name: T): ModalData[T] => {
  const data = useMemo(() => ModalStore.getState().data, []);
  return data as ModalData[T];
};
