import clsx from "clsx";
import { ModalName } from "src/models/modal-name";
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

export interface Modal {
  name: ModalName;
  large?: boolean;
}

export interface IModalStore {
  currentModal: Modal | undefined;
  setCurrentModal: (name: ModalName | undefined, data?: any) => void;
  hideModal: () => void;
  modals: Modal[];
  addModal: (modal: Modal) => void;
  removeModal: (name: ModalName) => void;
  data: any;
}

export const ModalStore = create<IModalStore>((set, get) => ({
  currentModal: undefined,
  setCurrentModal: (name, data) => {
    if (name === undefined) set({ currentModal: undefined, data: undefined });
    else {
      const modal = get().modals.find((modal) => modal.name === name);
      if (modal) set({ currentModal: modal, data });
      else throw new Error("Cannot find modal " + name);
    }
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
