import React, { useCallback } from "react";
import useModal, { ModalLayout } from "src/hooks/useModal";
import { ModalName } from "src/models/modal-name";
import { ModalStore } from "src/stores/ModalStore";
import Button from "../ui/inputs/Button";

const ErrorModal: React.FC = () => {
  const Modal = useModal({ name: ModalName.ERROR });
  const error = ModalStore(useCallback((state) => state.currentModal?.error, []));

  return (
    <Modal.Component>
      <ModalLayout.Content padding>
        <h2>An error occured</h2>
        <p>{error}</p>
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text="Close" type="red" onClick={Modal.hide} />
      </ModalLayout.Footer>
    </Modal.Component>
  );
};

export default ErrorModal;
