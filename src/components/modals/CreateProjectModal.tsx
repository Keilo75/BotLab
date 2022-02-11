import { Form, Formik, FormikBag } from "formik";
import React, { useCallback, useState } from "react";
import { ModalLayout, useModalReturnValue } from "src/hooks/useModal";
import Button from "../ui/inputs/Button";
import RadioButton from "../ui/inputs/RadioButton";
import TextInput from "../ui/inputs/TextInput";
import Label from "../ui/Label";
import ComponentGroup from "../ui/utils/ComponentGroup";
import useLoadingBar from "src/hooks/useLoadingBar";
import { IOptionsStore, OptionsStore } from "src/stores/OptionsStore";
import Container from "../ui/Container";
import { IModalStore, ModalStore } from "src/stores/ModalStore";
import { ModalName } from "src/models/modal-name";
import { sleep } from "src/lib/sleep";
import { ProjectStore } from "src/stores/ProjectStore";
import { v4 as uuid } from "uuid";

interface Props {
  modal: useModalReturnValue;
}

const initialValues = {
  projectName: "TestBot",
  projectFolder: "C:\\Users\\gesch\\Documents\\BotLab Bots\\TestBot",
};
type InitialValues = typeof initialValues;
type Errors = Record<keyof InitialValues, string | undefined>;

const CreateProjectModal: React.FC<Props> = ({ modal }) => {
  const addProject = ProjectStore(useCallback((state) => state.addProject, []));

  const LoadingBar = useLoadingBar();
  const emptyFolderOnProjectCreation = OptionsStore(
    useCallback((state) => state.options?.experimental.emptyFolderOnProjectCreation, [])
  );
  const openErrorModal = ModalStore(useCallback((state) => state.openErrorModal, []));

  const validate = async ({
    projectName,
    projectFolder,
  }: InitialValues): Promise<Errors | undefined> => {
    const errors: Errors = {
      projectName: undefined,
      projectFolder: undefined,
    };

    // Project name can't be empty
    if (projectName.length === 0) errors.projectName = "Required";
    else if (!projectName.match(/^[a-zA-Z\s]*$/))
      errors.projectName = "Project name may only include letters and spaces";

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
    LoadingBar.setPercentage(0);
    LoadingBar.setText("Copying template");

    if (emptyFolderOnProjectCreation)
      try {
        await window.template.emptyFolder(values.projectFolder);
      } catch {
        throw new Error("Could not empty folder.");
      }

    try {
      await window.template.copyTemplate(values.projectFolder, values.projectName);
    } catch {
      throw new Error("Could not copy template.");
    }

    LoadingBar.setPercentage(33);
    LoadingBar.setText("Installing dependencies.");
    try {
      await window.template.installDependencies(values.projectFolder);
    } catch {
      throw new Error("Could not install dependencies.");
    }

    LoadingBar.setPercentage(66);
    LoadingBar.setText("Creating project link");
    try {
      addProject({
        name: values.projectName,
        folder: values.projectFolder,
        id: uuid(),
        lastUpdated: Date.now(),
      });
      await sleep(500);
    } catch {
      throw new Error("Could not link project.");
    }

    LoadingBar.setPercentage(100);
    LoadingBar.setText("Finishing");
    await sleep(500);
  };

  return (
    <modal.Component>
      <Formik
        initialValues={initialValues}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setSubmitting }) => {
          LoadingBar.setPercentage(0);
          setSubmitting(true);

          try {
            await handleSubmit(values);
            modal.hide();
          } catch (err) {
            const error = err as Error;
            openErrorModal(error.message);
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
                {isSubmitting === false ? (
                  <ComponentGroup axis="vertical">
                    {emptyFolderOnProjectCreation && (
                      <Container
                        type="warning"
                        text="Empty folder on project creation is enabled."
                      />
                    )}
                    <div>
                      <Label text="Project Name" error={errors.projectName} />
                      <TextInput
                        name="projectName"
                        value={values.projectName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label text="Project Folder" error={errors.projectFolder} />
                      <ComponentGroup axis="horizontal">
                        <TextInput
                          name="projectFolder"
                          value={values.projectFolder}
                          onChange={handleInputChange}
                        />
                        <Button text="Browse" type="primary" onClick={browseFolders} />
                      </ComponentGroup>
                    </div>
                  </ComponentGroup>
                ) : (
                  <>
                    <LoadingBar.Component />
                  </>
                )}
              </ModalLayout.Content>
              <ModalLayout.Footer>
                <Button text="Create" type="success" submit disabled={isSubmitting} />
                <Button
                  text="Cancel"
                  type="transparent"
                  onClick={modal.hide}
                  disabled={isSubmitting}
                />
              </ModalLayout.Footer>
            </Form>
          );
        }}
      </Formik>
    </modal.Component>
  );
};

export default CreateProjectModal;
