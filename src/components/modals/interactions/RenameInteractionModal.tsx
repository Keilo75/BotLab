import React, { useEffect, useState } from "react";
import { Button, Group, TextInput } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { InteractionType, isTextBased } from "src/models/interactions";
import { validateInteractionName } from "src/lib/validater";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";

const InteractionActions = (state: IInteractionStore) => state.actions;

type Props = {
  name: string;
  type: InteractionType;
  id: string;
};

const RenameInteractionModalComponent: React.FC<ContextModalProps<Props>> = ({
  context,
  id,
  innerProps,
}) => {
  const { renameInteraction } = InteractionStore(InteractionActions);
  const [value, setValue] = useState(innerProps.name);
  const [error, setError] = useState<string>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    const newText = isTextBased(innerProps.type) ? text.replace(/\s+/g, "-").toLowerCase() : text;
    setValue(newText);
  };

  useEffect(() => {
    const error = validateInteractionName(value);
    setError(error);
  }, [value]);

  const handleSubmit = () => {
    if (value !== innerProps.name) renameInteraction(innerProps.id, value);
    context.closeModal(id);
  };

  return (
    <>
      <TextInput
        name="interaction-name"
        label="Interaction Name"
        value={value}
        onChange={handleInputChange}
        error={error}
      />
      <Group position="right" mt="md">
        <Button type="submit" disabled={error !== undefined} onClick={handleSubmit}>
          Rename
        </Button>
      </Group>
    </>
  );
};

export default RenameInteractionModalComponent;
