import React, { useCallback, useMemo, useRef } from "react";
import { ModalLayout, ModalStore } from "src/stores/ModalStore";
import Button from "../ui/inputs/Button";

const ErrorModal: React.FC = () => {
  const hideModal = ModalStore(useCallback((state) => state.hideModal, []));
  const error = useMemo<string>(() => ModalStore.getState().data, []);

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
