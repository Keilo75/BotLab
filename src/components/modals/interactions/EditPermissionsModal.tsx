import React from "react";
import Button from "src/components/ui/inputs/Button";
import {
  IModalStore,
  ModalLayout,
  ModalName,
  ModalStore,
  useModalData,
} from "src/stores/ModalStore";

const ModalActions = (state: IModalStore) => state.actions;

const EditPermissionsModal: React.FC = () => {
  const { hideModal } = ModalStore(ModalActions);

  const interaction = useModalData<ModalName.RENAME_INTERACTION>();

  return (
    <>
      <ModalLayout.Content padding>
        <h2>Edit Permissions</h2>
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text="Edit" type="primary" />
        <Button text="Cancel" type="transparent" onClick={hideModal} />
      </ModalLayout.Footer>
    </>
  );
};

export default EditPermissionsModal;
