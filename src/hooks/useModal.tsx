import React, { useCallback, useEffect, useRef, useState } from "react";
import { appState, AppStore } from "src/store";
import ReactDOM from "react-dom";

export const ModalLayout: { Content: React.FC; Footer: React.FC } = {
  Content: ({ children }) => <div className="modal-content">{children}</div>,
  Footer: ({ children }) => <div className="modal-footer">{children}</div>,
};

export interface currentModal extends useModalOptions {
  hide(): void;
}

export interface useModalReturnValue {
  Component: React.FC;
  show(): void;
  hide(): void;
}

export interface useModalOptions {
  name: string;
  large?: boolean;
}

const appStoreSelector = (state: AppStore) => ({
  setCurrentModal: state.setCurrentModal,
});

const useModal = (options: useModalOptions): useModalReturnValue => {
  const modal = document.getElementById("modal");

  const [visible, setVisible] = useState(false);
  const { setCurrentModal } = appState(appStoreSelector);

  const show = () => {
    setVisible(true);
    setCurrentModal({ ...options, hide });
  };

  const hide = () => {
    setVisible(false);
    setCurrentModal(undefined);
  };

  useEffect(() => {
    show();
  }, []);

  const component: React.FC = ({ children }) => {
    if (!modal || !visible) return null;

    return ReactDOM.createPortal(children, modal);
  };

  return { Component: useCallback(component, [visible]), show, hide };
};

export default useModal;
