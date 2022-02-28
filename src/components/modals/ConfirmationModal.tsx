import React, { useCallback, useEffect } from "react";
import {
  IModalStore,
  ModalLayout,
  ModalName,
  ModalStore,
  useModalData,
} from "src/stores/ModalStore";
import { getOption } from "src/stores/OptionsStore";
import Button from "../ui/inputs/Button";

const ModalActions = (state: IModalStore) => state.actions;

const ConfirmationModal: React.FC = () => {
  const { hideModal } = ModalStore(ModalActions);
  const confirmData = useModalData(ModalName.CONFIRMATION);

  useEffect(() => {
    const shouldConfirm = getOption("editor", confirmData.confirmationOption);

    if (shouldConfirm === false) {
      handleConfirm();
    }
  }, []);

  const handleConfirm = () => {
    confirmData.handleConfirm();
    hideModal();
  };

  return (
    <>
      <ModalLayout.Content padding>
        <h2>{confirmData.title}</h2>
        <p>{confirmData.text}</p>
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text={confirmData.buttonText} type="red" onClick={handleConfirm} />
        <Button text="Close" type="transparent" onClick={hideModal} />
      </ModalLayout.Footer>
    </>
  );
};

export default ConfirmationModal;
