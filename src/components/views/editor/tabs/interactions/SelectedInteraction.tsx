import React from "react";
import EditPermissionsModal from "src/components/modals/interactions/EditPermissionsModal";
import Button from "src/components/ui/inputs/Button";
import TextInput from "src/components/ui/inputs/TextInput";
import Label from "src/components/ui/Label";
import { Modal } from "src/components/ui/Modal";
import ComponentGroup from "src/components/ui/utils/ComponentGroup";
import { Interaction, InteractionPermission, InteractionTypes } from "src/models/interactions";
import { IModalStore, ModalStore } from "src/stores/ModalStore";
import { ModalName } from "src/models/modals";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";

const InteractionActions = (state: IInteractionStore) => state.actions;
const ModalActions = (state: IModalStore) => state.actions;

interface Props {
  interaction: Interaction;
}

const SelectedInteraction: React.FC<Props> = ({ interaction }) => {
  const { updateSelectedInteraction } = InteractionStore(InteractionActions);
  const { setCurrentModal } = ModalStore(ModalActions);

  const handleDescriptionChange = (value: string) => {
    updateSelectedInteraction("description", value);
  };

  const handlePermissionChange = (permissions: InteractionPermission) => {
    updateSelectedInteraction("permissions", permissions);
  };

  const openPermissionsModal = () => {
    setCurrentModal(ModalName.EDIT_PERMISSIONS);
  };

  return (
    <>
      <ComponentGroup axis="vertical">
        <div className="interaction-header">
          <div>
            <h2 className="no-margin">{interaction.name}</h2>
            <span className="text">{InteractionTypes[interaction.type]}</span>
          </div>
          <ComponentGroup axis="horizontal">
            <Button type="primary" text="Edit Permissions" onClick={openPermissionsModal} />
            <Button
              type="primary"
              text="Edit Parameters"
              disabled={interaction.type !== "command"}
            />
          </ComponentGroup>
        </div>
        {interaction.description !== undefined && (
          <div>
            <Label text="Description" />
            <TextInput
              name="description"
              value={interaction.description}
              onChange={handleDescriptionChange}
            />
          </div>
        )}
      </ComponentGroup>
      <Modal name={ModalName.EDIT_PERMISSIONS}>
        <EditPermissionsModal />
      </Modal>
    </>
  );
};

export default SelectedInteraction;
