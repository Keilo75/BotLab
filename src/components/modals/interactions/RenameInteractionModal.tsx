import React, { useEffect, useState } from "react";
import Button from "src/components/ui/inputs/Button";
import TextInput from "src/components/ui/inputs/TextInput";
import Label from "src/components/ui/Label";
import {
  getAllInteractionsWithSameParent as getInteractionsWithSameParent,
  validateInteractionName,
} from "src/models/interactions";
import {
  IModalStore,
  ModalLayout,
  ModalName,
  ModalStore,
  useModalData,
} from "src/stores/ModalStore";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";

const ModalActions = (state: IModalStore) => state.actions;
const InteractionActions = (state: IInteractionStore) => state.actions;

const RenameInteractionModal: React.FC = () => {
  const { hideModal } = ModalStore(ModalActions);
  const { renameInteraction } = InteractionStore(InteractionActions);

  const interaction = useModalData(ModalName.RENAME_INTERACTION);

  const [value, setValue] = useState(interaction.name);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const error = validateInteractionName(value);

    setError(error);
  }, [value]);

  const handleInputChange = (text: string) => {
    const newText = interaction.textBased ? text.replace(/\s+/g, "-").toLowerCase() : text;
    setValue(newText);
  };

  const handleSubmit = () => {
    if (error) return;

    if (value !== interaction.name) renameInteraction(interaction.id, value);
    hideModal();
  };

  return (
    <>
      <ModalLayout.Content padding>
        <h2>Rename Interaction</h2>
        <Label text="Interaction Name" error={error} />
        <TextInput
          name="interaction-name"
          value={value}
          onChange={handleInputChange}
          error={error !== undefined}
        />
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button
          text="Rename"
          type="primary"
          onClick={handleSubmit}
          disabled={error !== undefined}
        />
        <Button text="Cancel" type="transparent" onClick={hideModal} />
      </ModalLayout.Footer>
    </>
  );
};

export default RenameInteractionModal;
