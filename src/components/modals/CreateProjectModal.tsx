import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { ActionIcon, Alert, Button, Group, TextInput, Tooltip } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { getOption } from "src/stores/OptionsStore";
import { ProjectAction } from "src/stores/ProjectReducer";
import { validateProjectName } from "src/lib/validater";
import { AlertCircle, Folder } from "tabler-icons-react";

interface Props {
  dispatchProjects: React.Dispatch<ProjectAction>;
  close: () => void;
}

const initialValues = {
  name: "",
  folder: "",
};
type InitialValues = typeof initialValues;
type Errors = Record<keyof InitialValues, string | undefined>;

const CreateProjectModal: React.FC<Props> = ({ dispatchProjects, close }) => {
  const [loading, setLoading] = useState(false);
  const notifications = useNotifications();

  const emptyFolderOnProjectCreation = getOption("developer.emptyFolderOnProjectCreation");

  const form = useForm({
    initialValues,
  });

  const validate = async (values: InitialValues): Promise<Errors> => {
    const errors: Errors = {
      name: undefined,
      folder: undefined,
    };

    // Validate project name
    errors.name = validateProjectName(values.name);

    // Project folder can't be empty
    if (values.folder.length === 0) errors.folder = "Required";
    else {
      try {
        const isEmpty = await window.fs.isDirectoryEmpty(values.folder);
        if (!isEmpty && !emptyFolderOnProjectCreation)
          errors.folder = "The specified folder is not empty";
      } catch {
        errors.folder = "The specified folder does not exist";
      }
    }
    return errors;
  };

  const handleSubmit = async (values: InitialValues): Promise<void> => {
    setLoading(true);

    const errors = await validate(values);
    const hasErrors = Object.keys(errors).some((key) => errors[key as keyof Errors] !== undefined);
    if (hasErrors) {
      form.setErrors(errors);
      setLoading(false);
      return;
    }

    if (emptyFolderOnProjectCreation)
      try {
        await window.template.emptyFolder(values.folder);
      } catch {
        throw new Error("Could not empty folder.");
      }
    let botFilePath = "";
    try {
      botFilePath = await window.template.copyTemplate(values.folder, values.name);
    } catch {
      throw new Error("Could not copy template.");
    }
    dispatchProjects({ type: "add", project: { name: values.name, path: botFilePath } });

    close();
    setLoading(false);
  };

  const handleBrowseFolder = async () => {
    const response = await window.fs.openDialog({ properties: ["openDirectory"] });
    if (response.canceled) return;

    form.setFieldValue("folder", response.filePaths[0]);
  };

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        try {
          await handleSubmit(values);
        } catch (err) {
          const error = (err as Error).message;
          notifications.showNotification({
            title: "Could not create project.",
            message: error,
            color: "red",
          });
          close();
        }
      })}
    >
      {emptyFolderOnProjectCreation && (
        <Alert icon={<AlertCircle />} color="orange" mb="md">
          Empty folder on project creation is enabled.
        </Alert>
      )}
      <TextInput
        data-autofocus
        placeholder="Project Name"
        label="Project Name"
        {...form.getInputProps("name")}
      />
      <TextInput
        mt="md"
        placeholder="Project Folder"
        label="Project Folder"
        {...form.getInputProps("folder")}
        rightSection={
          <Tooltip label="Browse folder" withArrow transition="scale">
            <ActionIcon variant="transparent" onClick={handleBrowseFolder}>
              <Folder />
            </ActionIcon>
          </Tooltip>
        }
      />
      <Group position="right" mt="md">
        <Button color="teal" type="submit" loading={loading}>
          Create
        </Button>
      </Group>
    </form>
  );
};

export default CreateProjectModal;
