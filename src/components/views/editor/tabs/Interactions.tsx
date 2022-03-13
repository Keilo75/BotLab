import React, { useMemo } from "react";
import RenameInteractionModal from "src/components/modals/interactions/RenameInteractionModal";
import { Modal } from "src/components/ui/Modal";
import useMountedEffect from "src/hooks/useMountedEffect";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { ModalName } from "src/models/modals";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";
import InteractionList from "./interactions/interaction-list/InteractionList";
import SelectedInteraction from "./interactions/SelectedInteraction";

const InteractionsSelector = (state: IInteractionStore) => state.interactions;
const SelectedInteractionID = (state: IInteractionStore) => state.selectedInteractionID;
const InfoActions = (state: IInfoStore) => state.actions;

const Interactions: React.FC = () => {
  const interactions = InteractionStore(InteractionsSelector);
  const selectedInteractionID = InteractionStore(SelectedInteractionID);

  if (!interactions) return null;

  const { setDirty } = InfoStore(InfoActions);
  useMountedEffect(() => {
    setDirty(true);
  }, [interactions]);

  const selectedInteraction = useMemo(
    () => interactions?.find((i) => i.id === selectedInteractionID),
    [selectedInteractionID, interactions]
  );

  return (
    <>
      <div className="sidebar">
        <InteractionList />
      </div>
      <div className="tab-content interaction">
        {selectedInteraction && <SelectedInteraction interaction={selectedInteraction} />}
      </div>
      <Modal name={ModalName.RENAME_INTERACTION}>
        <RenameInteractionModal />
      </Modal>
    </>
  );
};

export default Interactions;
