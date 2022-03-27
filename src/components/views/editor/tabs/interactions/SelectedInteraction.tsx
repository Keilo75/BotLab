import { Box, Button, Group, Modal, Paper, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import InteractionOptionsModalComponent from "src/components/modals/interactions/InteractionOptionsModal";
import PermissionsModalComponent from "src/components/modals/interactions/PermissionsModal";
import {
  Interaction,
  InteractionOption,
  InteractionPermission,
  InteractionTypes,
  isTextBased,
} from "src/models/interactions";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";
import { ClipboardList, License } from "tabler-icons-react";

const InteractionActions = (state: IInteractionStore) => state.actions;

interface Props {
  interaction: Interaction;
}

const SelectedInteraction: React.FC<Props> = ({ interaction }) => {
  const [permissionsModalOpened, permissionsModalHandler] = useDisclosure(false);
  const [optionsModalOpened, optionsModalHandler] = useDisclosure(false);
  const { updateSelectedInteraction } = InteractionStore(InteractionActions);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    const newText = isTextBased(interaction.type) ? text.replace(/\s+/g, "-").toLowerCase() : text;

    updateSelectedInteraction("name", newText);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSelectedInteraction("description", e.target.value);
  };

  const handlePermissionsChange = (permissions: InteractionPermission) => {
    updateSelectedInteraction("permissions", permissions);
  };

  const handleOptionsChange = (options: InteractionOption[]) => {
    updateSelectedInteraction("options", options);
  };

  return (
    <Group direction="column" grow>
      <Paper withBorder p="md">
        <Group position="apart">
          <div>
            <Box sx={{ height: 36 }}>
              <Title order={2}>{interaction.name}</Title>
            </Box>
            <Text>{InteractionTypes[interaction.type]}</Text>
          </div>
          {interaction.type !== "event" && (
            <Group>
              <Button onClick={permissionsModalHandler.open} leftIcon={<License size={16} />}>
                Edit Permissions
              </Button>
              <Button
                onClick={optionsModalHandler.open}
                leftIcon={<ClipboardList size={16} />}
                disabled={interaction.type !== "command"}
              >
                Edit Options
              </Button>
            </Group>
          )}
        </Group>
      </Paper>
      <Group grow>
        <TextInput
          name="name"
          label="Name"
          value={interaction.name}
          required
          onChange={handleNameChange}
        />
        {interaction.description !== undefined && (
          <TextInput
            name="description"
            label="Description"
            value={interaction.description}
            onChange={handleDescriptionChange}
            required
          />
        )}
      </Group>
      {interaction.permissions !== undefined && (
        <Modal
          title="Edit permissions"
          opened={permissionsModalOpened}
          onClose={permissionsModalHandler.close}
          centered
        >
          <PermissionsModalComponent
            close={permissionsModalHandler.close}
            permissions={interaction.permissions}
            handlePermissionsChange={handlePermissionsChange}
          />
        </Modal>
      )}
      {interaction.options !== undefined && (
        <Modal
          title="Edit options"
          opened={true}
          onClose={optionsModalHandler.close}
          centered
          size="xl"
          className="interaction-options-modal"
        >
          <InteractionOptionsModalComponent
            close={optionsModalHandler.close}
            options={interaction.options}
            handleOptionsChange={handleOptionsChange}
          />
        </Modal>
      )}
    </Group>
  );
};

export default SelectedInteraction;
