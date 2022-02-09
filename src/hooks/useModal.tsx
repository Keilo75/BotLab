import React, { useCallback, useEffect, useRef, useState } from "react";
import { modalStore, ModalStore } from "src/stores/modalStore";
import ReactDOM from "react-dom";
import clsx from "clsx";
import { ModalName } from "src/models/modal-name";

interface ContentProps {
  padding?: boolean;
}

export const ModalLayout: { Content: React.FC<ContentProps>; Footer: React.FC } = {
  Content: ({ children, padding }) => (
    <div className={clsx("modal-content", padding && "modal-content-padding")}>{children}</div>
  ),
  Footer: ({ children }) => <div className="modal-footer">{children}</div>,
};

export interface useModalReturnValue {
  Component: React.FC;
  show(): void;
  hide(): void;
}

export interface useModalOptions {
  name: ModalName;
  large?: boolean;
}

const useModal = (options: useModalOptions): useModalReturnValue => {
  const modal = document.getElementById("modal");

  const [visible, setVisible] = useState(false);
  const { currentModal, setCurrentModal, addModal, removeModal } = modalStore(
    useCallback(
      (state) => ({
        currentModal: state.currentModal,
        setCurrentModal: state.setCurrentModal,
        addModal: state.addModal,
        removeModal: state.removeModal,
      }),
      []
    )
  );

  useEffect(() => {
    if (currentModal) setVisible(currentModal.name === options.name);
  }, [currentModal]);

  useEffect(() => {
    addModal({ ...options, hide });

    return () => {
      removeModal(options.name);
    };
  }, []);

  const show = () => {
    setCurrentModal(options.name);
  };

  const hide = () => {
    setCurrentModal(undefined);
  };

  const component: React.FC = ({ children }) => {
    if (!modal || !visible) return null;

    return ReactDOM.createPortal(children, modal);
  };

  return { Component: useCallback(component, [visible]), show, hide };
};

export default useModal;
