import { Button, Group, Radio, RadioGroup, Stack, Switch, Tabs, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDidUpdate } from "@mantine/hooks";
import React, { useMemo } from "react";
import { defaultOptions, IOptionsStore, OptionsStore } from "src/stores/OptionsStore";

interface Props {
  close: () => void;
}

const OptionsActions = (state: IOptionsStore) => state.actions;

const OptionsModalComponent: React.FC<Props> = ({ close }) => {
  const options = useMemo(() => OptionsStore.getState().options, []);
  const optionsActions = OptionsStore(OptionsActions);
  if (!options) return null;

  const form = useForm({ initialValues: options });

  useDidUpdate(() => {
    optionsActions.setOptions(form.values);
  }, [form.values]);

  const resetOptions = () => {
    form.setValues(defaultOptions);
  };

  return (
    <Stack>
      <Tabs orientation="vertical" className="options-tabs" tabPadding="xl">
        <Tabs.Tab label="General">
          <RadioGroup label="Theme" {...form.getInputProps("general.theme")} orientation="vertical">
            <Radio value="dark" label="Dark" />
            <Radio value="light" label="Light" />
          </RadioGroup>
        </Tabs.Tab>
        <Tabs.Tab label="Editor">
          <Title mb="xs" order={4}>
            Ask for confirmation when
          </Title>
          <Switch
            label="Deleting an interaction"
            {...form.getInputProps("editor.confirmInteractionDeletion", { type: "checkbox" })}
          />
        </Tabs.Tab>
        <Tabs.Tab label="Developer">
          <Title mb="xs" order={4}>
            Developer
          </Title>
          <Switch
            label="Pretty print save file"
            {...form.getInputProps("developer.prettyPrintSaveFile", {
              type: "checkbox",
            })}
          />
          <Title mt="md" mb="xs" order={4}>
            Dangerous
          </Title>
          <Switch
            label="Empty folder on project creation"
            {...form.getInputProps("developer.emptyFolderOnProjectCreation", {
              type: "checkbox",
            })}
          />
          <Title mt="md" mb="xs" order={4}>
            Reset Options
          </Title>
          <Button color="red" onClick={resetOptions}>
            Reset Options
          </Button>
        </Tabs.Tab>
      </Tabs>
      <Group position="right" mt="md">
        <Button onClick={close}>Close</Button>
      </Group>
    </Stack>
  );
};

export default OptionsModalComponent;
