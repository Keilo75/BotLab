import React from "react";
import useModal, { ModalLayout } from "src/hooks/useModal";
import { ModalName } from "src/models/modal-name";
import Button from "../ui/inputs/Button";
import Tab from "../ui/tabs/Tab";
import Tabs from "../ui/tabs/Tabs";

const AboutModal: React.FC = () => {
  const Modal = useModal({ name: ModalName.ABOUT, large: true });

  return (
    <Modal.Component>
      <ModalLayout.Content>
        <Tabs name="About">
          <Tab name="About">
            BotLab is a free and open source software which allows you to easily create your own
            Discord Bots.
          </Tab>
          <Tab name="Licenses"></Tab>
        </Tabs>
      </ModalLayout.Content>
      <ModalLayout.Footer>
        <Button text="Close" type="primary" onClick={Modal.hide} />
      </ModalLayout.Footer>
    </Modal.Component>
  );
};

export default AboutModal;
