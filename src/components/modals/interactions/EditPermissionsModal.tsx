import React from "react";
import Button from "src/components/ui/inputs/Button";
import { IModalStore, ModalLayout, ModalStore } from "src/stores/ModalStore";
import Checkbox from "src/components/ui/inputs/Checkbox";
import Label from "src/components/ui/Label";

const ModalActions = (state: IModalStore) => state.actions;

const EditPermissionsModal: React.FC = () => {
  const { hideModal } = ModalStore(ModalActions);

  const handleDisabledByDefaultChange = (value: boolean) => {};

  return (
    <>
      <ModalLayout.Content padding>
        <h2>Edit Permissions</h2>
        <Checkbox
          checked={false}
          name="disabledByDefault"
          onChange={handleDisabledByDefaultChange}
          label="Disabled by default"
        />
        <Label text="Exceptions" />
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text="Edit" type="primary" />
        <Button text="Cancel" type="transparent" onClick={hideModal} />
      </ModalLayout.Footer>
    </>
  );
};

export default EditPermissionsModal;
