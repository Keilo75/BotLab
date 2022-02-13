import React from "react";
import useModal, { ModalLayout } from "src/hooks/useModal";
import { ModalName } from "src/models/modal-name";
import { OptionsStore } from "src/stores/OptionsStore";
import Button from "../ui/inputs/Button";
import InputGroup from "../ui/inputs/InputGroup";
import RadioButton from "../ui/inputs/RadioButton";
import ToggleSwitch from "../ui/inputs/ToggleSwitch";
import Label from "../ui/Label";
import Tab from "../ui/tabs/Tab";
import Tabs from "../ui/tabs/Tabs";

const OptionsModal: React.FC = () => {
  const Modal = useModal({ name: ModalName.OPTIONS, large: true });

  const options = OptionsStore();
  if (!options.options) return null;

  return (
    <Modal.Component>
      <ModalLayout.Content>
        <Tabs name="Options">
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
        <Button text="Close" type="primary" onClick={Modal.hide} />
      </ModalLayout.Footer>
    </Modal.Component>
  );
};

export default OptionsModal;
