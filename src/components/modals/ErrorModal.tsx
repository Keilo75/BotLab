import React, { useCallback } from "react";
import useModal, { ModalLayout } from "src/hooks/useModal";
import { ModalName } from "src/models/modal-name";
import { modalStore } from "src/stores/modalStore";
import Button from "../ui/inputs/Button";

const ErrorModal: React.FC = () => {
  const Modal = useModal({ name: ModalName.ERROR });
  const error = modalStore(useCallback((state) => state.currentModal?.error, []));

  return (
    <Modal.Component>
      <ModalLayout.Content padding>
        <h2>An error occured</h2>
        <p style={{ margin: 0 }}>{error}</p>
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text="Close" type="red" onClick={Modal.hide} />
      </ModalLayout.Footer>
    </Modal.Component>
  );
};

export default ErrorModal;
