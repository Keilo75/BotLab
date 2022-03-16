import { Alert, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import React, { useCallback, useMemo } from "react";
import ExternalLink from "src/components/ui/ExternalLink";
import InputGroup from "src/components/ui/inputs/InputGroup";
import { validateProjectName } from "src/lib/validater";
import { ProjectSettings } from "src/models/project";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { SettingsStore } from "src/stores/project-stores/SettingsStore";
import { AlertCircle } from "tabler-icons-react";

const InfoStoreActions = (state: IInfoStore) => state.actions;

const SettingsTab: React.FC = () => {
  const [settings, setSettings] = SettingsStore(
    useCallback((state) => [state.settings, state.setSettings], [])
  );
  if (!settings) return null;

  const { setDirty } = InfoStore(InfoStoreActions);
  useDidUpdate(() => {
    setDirty(true);
  }, [settings]);

  const handleSettingsChange = (state: ProjectSettings) => {
    setSettings(state);
  };

  const projectNameError = useMemo(() => validateProjectName(settings.name), [settings.name]);

  return (
    <Group className="main-content in-editor" direction="column" grow mt="md">
      <Text>
        Use this page to register your bots settings. If you have not done so yet, create a new Bot
        Account in the{" "}
        <ExternalLink href="https://discord.com/developers/applications">
          Discord Developer Portal
        </ExternalLink>
        .
      </Text>
      <InputGroup state={settings} onChange={handleSettingsChange}>
        {(form) => (
          <>
            <TextInput
              label="Project Name"
              {...form.getInputProps("name")}
              error={projectNameError}
            />
            <PasswordInput label="Bot Token" {...form.getInputProps("token")} />
            <Alert icon={<AlertCircle />} color="orange" mb="md">
              Never share your bots token with anybody! If you leak it, hackers can abuse your bot
              and perform malicious acts with it.
            </Alert>
          </>
        )}
      </InputGroup>
    </Group>
  );
};

export default SettingsTab;
