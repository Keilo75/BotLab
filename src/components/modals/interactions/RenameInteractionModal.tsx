import React, { useCallback, useEffect, useState } from "react";
import Container from "src/components/ui/Container";
import Button from "src/components/ui/inputs/Button";
import TextInput from "src/components/ui/inputs/TextInput";
import Label from "src/components/ui/Label";
import { validateInteractionName } from "src/models/interactions";
import { InteractionTypes } from "src/models/project";
import { ModalLayout, ModalName, ModalStore, useModalData } from "src/stores/ModalStore";

const RenameInteractionModal: React.FC = () => {
  const hideModal = ModalStore(useCallback((state) => state.hideModal, []));
  const interaction = useModalData(ModalName.RENAME_INTERACTION);

  const [value, setValue] = useState(interaction.name);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const error = validateInteractionName(value, interaction.type);
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
        <Container type="info" className="mb">
          {InteractionTypes[interaction.type]} names must have 1-32 characters and be unique among
          their type.
        </Container>
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
