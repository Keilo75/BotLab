import { Button, Group, Modal, Paper, Text, TextInput, Title } from "@mantine/core";
import React from "react";
import PermissionsModalComponent from "src/components/modals/interactions/PermissionsModal";
import useModal from "src/hooks/useModal";
import {
  Interaction,
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
  const PermissionsModal = useModal();
  const { updateSelectedInteraction } = InteractionStore(InteractionActions);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSelectedInteraction("description", e.target.value);
  };

  const handlePermissionsChange = (permissions: InteractionPermission) => {
    updateSelectedInteraction("permissions", permissions);
  };

  return (
    <Group direction="column" grow>
      <Paper withBorder p="md">
        <Group position="apart">
          <div>
            <Title order={2}>{interaction.name}</Title>
            <Text>{InteractionTypes[interaction.type]}</Text>
          </div>
          {isTextBased(interaction.type) && (
            <Group>
              <Button onClick={PermissionsModal.show} leftIcon={<License size={16} />}>
                Edit Permissions
              </Button>
              <Button
                leftIcon={<ClipboardList size={16} />}
                disabled={interaction.type !== "command"}
              >
                Edit Parameters
              </Button>
            </Group>
          )}
        </Group>
      </Paper>
      {interaction.description !== undefined && (
        <TextInput
          name="description"
          label="Description"
          value={interaction.description}
          onChange={handleDescriptionChange}
          required
        />
      )}
      {interaction.permissions !== undefined && (
        <Modal
          title="Edit permissions"
          opened={PermissionsModal.opened}
          onClose={PermissionsModal.close}
        >
          <PermissionsModalComponent
            close={PermissionsModal.close}
            permissions={interaction.permissions}
            handlePermissionsChange={handlePermissionsChange}
          />
        </Modal>
      )}
    </Group>
  );
};

export default SelectedInteraction;
