import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import Button from "../ui/inputs/Button";
import TextInput from "../ui/inputs/TextInput";
import Label from "../ui/Label";
import ComponentGroup from "../ui/utils/ComponentGroup";
import { getOption } from "src/stores/OptionsStore";
import Container from "../ui/Container";
import { IModalStore, ModalLayout, ModalName, ModalStore } from "src/stores/ModalStore";
import { ProjectAction } from "src/stores/ProjectReducer";
import { validateProjectName } from "src/lib/validater";

const ModalActions = (state: IModalStore) => state.actions;
interface Props {
  dispatchProjects: React.Dispatch<ProjectAction>;
}

const initialValues = {
  projectName: "TestBot",
  projectFolder: "C:\\Users\\gesch\\Documents\\BotLab Bots\\TestBot",
};
type InitialValues = typeof initialValues;
type Errors = Record<keyof InitialValues, string | undefined>;

const CreateProjectModal: React.FC<Props> = ({ dispatchProjects }) => {
  const { hideModal, setCurrentModal } = ModalStore(ModalActions);

  const emptyFolderOnProjectCreation = getOption("experimental", "emptyFolderOnProjectCreation");

  const validate = async ({
    projectName,
    projectFolder,
  }: InitialValues): Promise<Errors | undefined> => {
    const errors: Errors = {
      projectName: undefined,
      projectFolder: undefined,
    };

    // Validate project name
    errors.projectName = validateProjectName(projectName);

    // Project folder can't be empty
    if (projectFolder.length === 0) errors.projectFolder = "Required";
    else {
      try {
        const isEmpty = await window.fs.isDirectoryEmpty(projectFolder);

        if (!isEmpty && !emptyFolderOnProjectCreation)
          errors.projectFolder = "The specified folder is not empty";
      } catch {
        errors.projectFolder = "The specified folder does not exist";
      }
    }

    const hasErrors = Object.keys(errors).some((key) => errors[key as keyof Errors] !== undefined);
    if (!hasErrors) return;

    return errors;
  };

  const handleSubmit = async (values: InitialValues): Promise<void> => {
    if (emptyFolderOnProjectCreation)
      try {
        await window.template.emptyFolder(values.projectFolder);
      } catch {
        throw new Error("Could not empty folder.");
      }

    let botFilePath = "";
    try {
      botFilePath = await window.template.copyTemplate(values.projectFolder, values.projectName);
    } catch {
      throw new Error("Could not copy template.");
    }

    dispatchProjects({ type: "add", project: { name: values.projectName, path: botFilePath } });
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values) => {
        try {
          await handleSubmit(values);
          hideModal();
        } catch (err) {
          const error = err as Error;
          setCurrentModal(ModalName.ERROR, error.message);
        }
      }}
    >
      {({ values, errors, setFieldValue, isSubmitting }) => {
        const handleInputChange = (text: string, name: string) => {
          setFieldValue(name, text);
        };

        const browseFolders = async () => {
          const response = await window.fs.openDialog({ properties: ["openDirectory"] });
          if (response.canceled) return;

          setFieldValue("projectFolder", response.filePaths[0]);
        };

        return (
          <Form className="modal-form">
            <ModalLayout.Content padding>
              <h2>Create Project</h2>
              {
                <ComponentGroup axis="vertical">
                  {emptyFolderOnProjectCreation && (
                    <Container type="warning" text="Empty folder on project creation is enabled." />
                  )}
                  <div>
                    <Label text="Project Name" error={errors.projectName} />
                    <TextInput
                      name="projectName"
                      value={values.projectName}
                      onChange={handleInputChange}
                      error={errors.projectName !== undefined}
                    />
                  </div>
                  <div>
                    <Label text="Project Folder" error={errors.projectFolder} />
                    <ComponentGroup axis="horizontal">
                      <TextInput
                        name="projectFolder"
                        value={values.projectFolder}
                        onChange={handleInputChange}
                        error={errors.projectFolder !== undefined}
                      />
                      <Button text="Browse" type="primary" onClick={browseFolders} />
                    </ComponentGroup>
                  </div>
                </ComponentGroup>
              }
            </ModalLayout.Content>
            <ModalLayout.Footer>
              <Button text="Create" type="success" submit disabled={isSubmitting} />
              <Button
                text="Cancel"
                type="transparent"
                onClick={hideModal}
                disabled={isSubmitting}
              />
            </ModalLayout.Footer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateProjectModal;
