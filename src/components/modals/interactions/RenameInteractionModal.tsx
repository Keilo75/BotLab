import React, { useCallback, useEffect, useMemo, useState } from "react";
import Container from "src/components/ui/Container";
import Button from "src/components/ui/inputs/Button";
import TextInput from "src/components/ui/inputs/TextInput";
import Label from "src/components/ui/Label";
import {
  getAllInteractionsWithSameParent as getInteractionsWithSameParent,
  validateInteractionName,
} from "src/models/interactions";
import { ModalLayout, ModalName, ModalStore, useModalData } from "src/stores/ModalStore";
import { InteractionStore } from "src/stores/project-stores/InteractionStore";

const RenameInteractionModal: React.FC = () => {
  const hideModal = ModalStore(useCallback((state) => state.hideModal, []));
  const interaction = useModalData(ModalName.RENAME_INTERACTION);
  const sameParentInteractions = useMemo(() => {
    const interactions = InteractionStore.getState().interactions;
    if (!interactions) return [];

    const filteredInteractions = interactions.filter(
      (i) => i.metaData.type === interaction.metaData.type
    );
    return getInteractionsWithSameParent(filteredInteractions, interaction.metaData.parent);
  }, []);

  console.log(interaction);

  const [value, setValue] = useState(interaction.metaData.name);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const error = validateInteractionName(value, interaction.id, sameParentInteractions);
    setError(error);
  }, [value]);

  const handleInputChange = (text: string) => {
    // If type is set to command or folder, only allow lowercase
  };

  const handleSubmit = () => {};

  return (
    <>
      <ModalLayout.Content padding>
        <h2>Rename Interaction</h2>
        <Container type="info" className="mb"></Container>
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
