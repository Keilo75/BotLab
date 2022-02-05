import React from "react";
import { ModalLayout, useModalReturnValue } from "src/hooks/useModal";
import Button from "../ui/button/Button";
import RadioButton from "../ui/inputs/RadioButton";
import Tab from "../ui/tabs/Tab";
import Tabs from "../ui/tabs/Tabs";

interface Props {
  modal: useModalReturnValue;
}

const OptionsModalComponent: React.FC<Props> = ({ modal }) => {
  return (
    <modal.Component>
      <ModalLayout.Content>
        <Tabs name="Options">
          <Tab name="General">
            <RadioButton selectedIndex={0} onChange={() => null} options={["Dark", "Light"]} />
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
