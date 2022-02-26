import React from "react";
import RenameInteractionModal from "src/components/modals/interactions/RenameInteractionModal";
import { Modal } from "src/components/ui/Modal";
import { ModalName } from "src/stores/ModalStore";
import InteractionList from "./interactions/interaction-list/InteractionList";

const Interactions: React.FC = () => {
  return (
    <>
      <div className="sidebar">
        <InteractionList />
      </div>
      <div className="interaction"></div>
      <Modal name={ModalName.RENAME_INTERACTION}>
        <RenameInteractionModal />
      </Modal>
    </>
  );
};

export default Interactions;
