import { Button, Group, Paper, Text, TextInput, Title, Tooltip } from "@mantine/core";
import React from "react";
import { Interaction, InteractionTypes } from "src/models/interactions";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";

const InteractionActions = (state: IInteractionStore) => state.actions;

interface Props {
  interaction: Interaction;
}

const SelectedInteraction: React.FC<Props> = ({ interaction }) => {
  const { updateSelectedInteraction } = InteractionStore(InteractionActions);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSelectedInteraction("description", e.target.value);
  };

  return (
    <Group direction="column" grow>
      <Paper withBorder p="md">
        <Group position="apart">
          <div>
            <Title order={2}>{interaction.name}</Title>
            <Text>{InteractionTypes[interaction.type]}</Text>
          </div>
          <Group>
            <Button>Edit Permissions</Button>
            <Tooltip
              label="This interaction type does not support parameters."
              transition="pop"
              withArrow
              disabled={interaction.type === "command"}
            >
              <Button disabled={interaction.type !== "command"}>Edit Parameters</Button>
            </Tooltip>
          </Group>
        </Group>
      </Paper>
      {interaction.description !== undefined && (
        <TextInput
          name="description"
          label="Description"
          required
          value={interaction.description}
          onChange={handleDescriptionChange}
        />
      )}
    </Group>
  );
};

export default SelectedInteraction;
