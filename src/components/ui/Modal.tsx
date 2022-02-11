import { AnimatePresence, motion } from "framer-motion";
import React, { MouseEventHandler, useCallback, useEffect, useRef } from "react";
import { IModalStore, ModalStore } from "src/stores/ModalStore";
import ReactDOM from "react-dom";
import clsx from "clsx";
import ReactFocusLock from "react-focus-lock";

const Modal: React.FC = () => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const currentModal = ModalStore(useCallback((state) => state.currentModal, []));

  const handleModalClick: MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const animationValue = currentModal ? 1 : 0;

  const component = (
    <motion.div
      key="modal-overlay"
      className={clsx("modal-overlay", currentModal && "modal-overlay-visible")}
      onMouseDown={currentModal?.hide}
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
            onClick={currentModal?.hide}
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

export default Modal;
