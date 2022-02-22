import { motion } from "framer-motion";
import React, { MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { ModalStore, Modal as ModalProps } from "src/stores/ModalStore";
import ReactDOM from "react-dom";
import clsx from "clsx";
import ReactFocusLock from "react-focus-lock";

const ModalTemplate: React.FC = () => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const [currentModal, hideModal] = ModalStore(
    useCallback((state) => [state.currentModal, state.hideModal], [])
  );

  const handleModalClick: MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const animationValue = currentModal ? 1 : 0;

  const component = (
    <motion.div
      key="modal-overlay"
      className={clsx("modal-overlay", currentModal && "modal-overlay-visible")}
      onMouseDown={hideModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: animationValue }}
      transition={{ duration: 0.2 }}
    >
      <ReactFocusLock disabled={!currentModal}>
        <motion.div
          key="modal"
          className={clsx("modal", currentModal?.large && "modal-large")}
          id="modal"
          onMouseDown={handleModalClick}
          initial={{ scale: 0 }}
          animate={{ scale: animationValue }}
          transition={{ duration: 0.2, ease: [0, 0.9, 0.3, 1] }}
        >
          <button
            className="modal-close-button"
            onClick={hideModal}
            tabIndex={currentModal ? 0 : -1}
          >
            <span>×</span>
          </button>
        </motion.div>
      </ReactFocusLock>
    </motion.div>
  );

  return ReactDOM.createPortal(component, modalRoot);
};

export default ModalTemplate;

export const Modal: React.FC<ModalProps> = (props) => {
  const modalTemplate = document.getElementById("modal");
  const [visible, setVisible] = useState(false);

  const [currentModal, addModal, removeModal] = ModalStore(
    useCallback((state) => [state.currentModal, state.addModal, state.removeModal], [])
  );
  useEffect(() => {
    const { children, ...modalProps } = props;
    addModal(modalProps);

    return () => {
      removeModal(props.name);
    };
  }, []);

  useEffect(() => {
    setVisible(currentModal?.name === props.name);
  }, [currentModal]);

  if (!visible || !modalTemplate) return null;

  return ReactDOM.createPortal(props.children, modalTemplate);
};
