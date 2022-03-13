import React from "react";
import { IModalStore, ModalLayout, ModalStore, useModalData } from "src/stores/ModalStore";
import { ModalName } from "src/models/modals";
import Button from "../ui/inputs/Button";

const ModalActions = (state: IModalStore) => state.actions;

const ErrorModal: React.FC = () => {
  const { hideModal } = ModalStore(ModalActions);

  const error = useModalData<ModalName.ERROR>();

  return (
    <>
      <ModalLayout.Content padding>
        <h2>An error occured</h2>
        <p>{error}</p>
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text="Close" type="red" onClick={hideModal} />
      </ModalLayout.Footer>
    </>
  );
};

export default ErrorModal;
