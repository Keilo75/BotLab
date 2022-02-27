import React, { useCallback } from "react";
import { IModalStore, ModalLayout, ModalStore } from "src/stores/ModalStore";
import { OptionsStore } from "src/stores/OptionsStore";
import Button from "../ui/inputs/Button";
import InputGroup from "../ui/inputs/InputGroup";
import RadioButton from "../ui/inputs/RadioButton";
import ToggleSwitch from "../ui/inputs/ToggleSwitch";
import Label from "../ui/Label";
import Tab from "../ui/tabs/Tab";
import Tabs from "../ui/tabs/Tabs";

const ModalActions = (state: IModalStore) => state.actions;

const OptionsModal: React.FC = () => {
  const { hideModal } = ModalStore(ModalActions);

  const options = OptionsStore();
  if (!options.options) return null;

  return (
    <>
      <ModalLayout.Content>
        <Tabs name="Options" defaultTab={0}>
          <Tab name="General">
            <InputGroup state={options.options.general} onChange={options.setGeneral}>
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
            <InputGroup state={options.options.editor} onChange={options.setEditor}>
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
          <Tab name="Experimental">
            <InputGroup state={options.options.experimental} onChange={options.setExperimental}>
              {(state, setState) => (
                <>
                  <Label text="Dangerous" />
                  <ToggleSwitch
                    name="emptyFolderOnProjectCreation"
                    label="Empty folder on project creation"
                    checked={state.emptyFolderOnProjectCreation}
                    onChange={setState}
                  />
                </>
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
