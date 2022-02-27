import React, { useCallback, useMemo } from "react";
import RenameInteractionModal from "src/components/modals/interactions/RenameInteractionModal";
import { Modal } from "src/components/ui/Modal";
import useMountedEffect from "src/hooks/useMountedEffect";
import { InfoStore } from "src/stores/InfoStore";
import { ModalName } from "src/stores/ModalStore";
import { InteractionStore } from "src/stores/project-stores/InteractionStore";
import InteractionList from "./interactions/interaction-list/InteractionList";
import SelectedInteraction from "./interactions/SelectedInteraction";

const Interactions: React.FC = () => {
  const [selectedInteractionID, interactions] = InteractionStore(
    useCallback((state) => [state.selectedInteractionID, state.interactions], [])
  );
  if (!interactions) return null;

  const setDirty = InfoStore(useCallback((state) => state.setDirty, []));
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
