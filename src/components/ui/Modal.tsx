import { AnimatePresence, motion } from "framer-motion";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { appState, AppStore } from "src/store";
import ReactDOM from "react-dom";
import clsx from "clsx";
import ReactFocusLock from "react-focus-lock";

const appStoreSelector = (state: AppStore) => ({
  currentModal: state.currentModal,
});

const Modal: React.FC = () => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const { currentModal } = appState(appStoreSelector);

  const handleModalClick: MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const animationValue = currentModal ? 1 : 0;

  const component = (
    <motion.div
      key="modal-overlay"
      className={clsx("modal-overlay", currentModal && "modal-overlay-visible")}
      onClick={currentModal?.hide}
      initial={{ opacity: 0 }}
      animate={{ opacity: animationValue }}
      transition={{ duration: 0.2 }}
    >
      <ReactFocusLock disabled={!currentModal}>
        <motion.div
          key="modal"
          className={clsx("modal", currentModal?.large && "modal-large")}
          id="modal"
          onClick={handleModalClick}
          initial={{ scale: 0 }}
          animate={{ scale: animationValue }}
          transition={{ duration: 0.2, ease: [0, 0.9, 0.3, 1] }}
        >
          <button className="modal-close-button" onClick={currentModal?.hide}>
            <span>×</span>
          </button>
        </motion.div>
      </ReactFocusLock>
    </motion.div>
  );

  return ReactDOM.createPortal(component, modalRoot);
};

export default Modal;
