import React from "react";
import { IModalStore, ModalLayout, ModalStore } from "src/stores/ModalStore";
import { defaultOptions, IOptionsStore, OptionsStore } from "src/stores/OptionsStore";
import Button from "../ui/inputs/Button";
import InputGroup from "../ui/inputs/InputGroup";
import RadioButton from "../ui/inputs/RadioButton";
import ToggleSwitch from "../ui/inputs/ToggleSwitch";
import Label from "../ui/Label";
import Tab from "../ui/tabs/Tab";
import Tabs from "../ui/tabs/Tabs";
import ComponentGroup from "../ui/utils/ComponentGroup";

const ModalActions = (state: IModalStore) => state.actions;
const Options = (state: IOptionsStore) => state.options;
const OptionsActions = (state: IOptionsStore) => state.actions;

const OptionsModal: React.FC = () => {
  const { hideModal } = ModalStore(ModalActions);

  const options = OptionsStore(Options);
  const optionsActions = OptionsStore(OptionsActions);
  if (!options) return null;

  const resetOptions = () => {
    optionsActions.setOptions(defaultOptions);
  };

  return (
    <>
      <ModalLayout.Content>
        <Tabs name="Options" defaultTab={0}>
          <Tab name="General">
            <InputGroup state={options.general} onChange={optionsActions.setGeneral}>
              {(state, setState) => (
                <>
                  <Label text="Theme" />
                  <RadioButton
                    name="theme"
                    selectedIndex={state.theme}
                    onChange={setState}
                    options={["Dark", "Light"]}
                  />
                </>
              )}
            </InputGroup>
          </Tab>
          <Tab name="Editor">
            <InputGroup state={options.editor} onChange={optionsActions.setEditor}>
              {(state, setState) => (
                <>
                  <Label text="Ask for confirmation when" />
                  <ToggleSwitch
                    name="confirmInteractionDeletion"
                    label="Deleting an interaction"
                    checked={state.confirmInteractionDeletion}
                    onChange={setState}
                  />
                </>
              )}
            </InputGroup>
          </Tab>
          <Tab name="Developer">
            <InputGroup state={options.developer} onChange={optionsActions.setDeveloper}>
              {(state, setState) => (
                <ComponentGroup axis="vertical">
                  <div>
                    <Label text="Dangerous" />
                    <ToggleSwitch
                      name="emptyFolderOnProjectCreation"
                      label="Empty folder on project creation"
                      checked={state.emptyFolderOnProjectCreation}
                      onChange={setState}
                    />
                  </div>
                  <div>
                    <Label text="Reset Options" />
                    <Button type="primary" text="Reset Options" onClick={resetOptions} />
                  </div>
                </ComponentGroup>
              )}
            </InputGroup>
          </Tab>
        </Tabs>
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text="Close" type="primary" onClick={hideModal} />
      </ModalLayout.Footer>
    </>
  );
};

export default OptionsModal;
