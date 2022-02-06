import { Form, Formik } from "formik";
import React from "react";
import { ModalLayout, useModalReturnValue } from "src/hooks/useModal";
import Button from "../ui/button/Button";
import RadioButton from "../ui/inputs/RadioButton";
import TextInput from "../ui/inputs/TextInput";
import Label from "../ui/Label";
import ComponentGroup from "../ui/utils/ComponentGroup";

interface Props {
  modal: useModalReturnValue;
}

const initialValues = {
  projectName: "d",
  projectFolder: "C:\\Users\\gesch\\Documents\\BotLab Bots\\TestBot",
  template: 0,
};
type InitialValues = typeof initialValues;
type Errors = Record<keyof InitialValues, string | undefined>;

const CreateProjectModal: React.FC<Props> = ({ modal }) => {
  const validate = async ({
    projectName,
    projectFolder,
    template,
  }: InitialValues): Promise<Errors | undefined> => {
    const errors: Errors = {
      projectName: undefined,
      projectFolder: undefined,
      template: undefined,
    };

    // Project name can't be empty
    if (projectName.length === 0) errors.projectName = "Required";

    // Project folder can't be empty
    if (projectFolder.length === 0) {
      errors.projectFolder = "Required";
    } else {
      try {
        const isEmpty = await window.fs.isDirectoryEmpty(projectFolder);
        if (!isEmpty) errors.projectFolder = "The specified folder is not empty";
      } catch {
        errors.projectFolder = "The specified folder does not exist";
      }
    }

    const hasErrors = Object.keys(errors).some((key) => errors[key as keyof Errors] !== undefined);
    if (!hasErrors) return;

    return errors;
  };

  const handleSubmit = async (values: InitialValues) => {};

  return (
    <modal.Component>
      <Formik
        initialValues={initialValues}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
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
            <Form>
              <ModalLayout.Content padding>
                <h2>Create Project</h2>
                <ComponentGroup axis="vertical">
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
                  <div>
                    <Label text="Project Template" />
                    <RadioButton
                      name="projectTemplate"
                      selectedIndex={0}
                      onChange={() => null}
                      options={["None"]}
                    />
                  </div>
                </ComponentGroup>
              </ModalLayout.Content>
              <ModalLayout.Footer>
                <Button text="Create" type="success" submit disabled={isSubmitting} />
                <Button text="Cancel" type="transparent" onClick={modal.hide} />
              </ModalLayout.Footer>
            </Form>
          );
        }}
      </Formik>
    </modal.Component>
  );
};

export default CreateProjectModal;
