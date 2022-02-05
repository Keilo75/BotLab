import React, { useState } from "react";
import { ModalLayout, useModalReturnValue } from "src/hooks/useModal";
import { optionsStore } from "src/stores/optionsStore";
import Button from "../ui/button/Button";
import InputGroup from "../ui/inputs/InputGroup";
import RadioButton from "../ui/inputs/RadioButton";
import Tab from "../ui/tabs/Tab";
import Tabs from "../ui/tabs/Tabs";

interface Props {
  modal: useModalReturnValue;
}

const OptionsModalComponent: React.FC<Props> = ({ modal }) => {
  const options = optionsStore();

  return (
    <modal.Component>
      <ModalLayout.Content>
        <Tabs name="Options">
          <Tab name="General">
            <InputGroup state={options.options.general} onChange={options.setGeneral}>
              {(state, setState) => (
                <>
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
          <Tab name="Editor"></Tab>
          <Tab name="About"></Tab>
        </Tabs>
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text="Close" type="primary" onClick={modal.hide} />
      </ModalLayout.Footer>
    </modal.Component>
  );
};

export default OptionsModalComponent;
