import { Box, Button, Group, Modal, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useRef } from "react";
import CommandOptionsModalComponent from "src/components/modals/interactions/CommandOptionsModal";
import InteractionPermissionsModalComponent from "src/components/modals/interactions/InteractionPermissionsModal";
import useStacktrace from "src/hooks/useStacktrace";
import {
  Interaction,
  CommandOption,
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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

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

  const handleOptionsChange = (options: CommandOption[]) => {
    updateSelectedInteraction("options", options);
  };

  useStacktrace("interaction", ({ finishStacktrace, key }) => {
    if (key === "interaction name") nameInputRef.current?.focus();
    if (key === "interaction description") descriptionInputRef.current?.focus();

    finishStacktrace();
  });

  useStacktrace("permission exception", () => {
    permissionsModalHandler.open();
  });

  useStacktrace("option", () => {
    optionsModalHandler.open();
  });

  return (
    <Stack>
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
          ref={nameInputRef}
        />
        {interaction.description !== undefined && (
          <TextInput
            name="description"
            label="Description"
            value={interaction.description}
            onChange={handleDescriptionChange}
            required
            ref={descriptionInputRef}
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
          <InteractionPermissionsModalComponent
            close={permissionsModalHandler.close}
            permissions={interaction.permissions}
            handlePermissionsChange={handlePermissionsChange}
          />
        </Modal>
      )}
      {interaction.options !== undefined && (
        <Modal
          title="Edit options"
          opened={optionsModalOpened}
          onClose={optionsModalHandler.close}
          centered
          size="xl"
          className="interaction-options-modal"
        >
          <CommandOptionsModalComponent
            close={optionsModalHandler.close}
            options={interaction.options}
            handleOptionsChange={handleOptionsChange}
          />
        </Modal>
      )}
    </Stack>
  );
};

export default SelectedInteraction;
