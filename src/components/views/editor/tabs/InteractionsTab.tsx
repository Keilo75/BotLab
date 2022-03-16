import React, { useMemo } from "react";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";
import { useDidUpdate } from "@mantine/hooks";
import { Paper } from "@mantine/core";
import useBackgroundColor from "src/hooks/useBackgroundColor";
import InteractionSidebar from "./interactions/interaction-sidebar/InteractionSidebar";
import SelectedInteraction from "./interactions/SelectedInteraction";

const InteractionsSelector = (state: IInteractionStore) => state.interactions;
const SelectedInteractionID = (state: IInteractionStore) => state.selectedInteractionID;
const InfoActions = (state: IInfoStore) => state.actions;

const InteractionsTab: React.FC = () => {
  const interactions = InteractionStore(InteractionsSelector);
  const selectedInteractionID = InteractionStore(SelectedInteractionID);

  const { setDirty } = InfoStore(InfoActions);
  useDidUpdate(() => {
    setDirty(true);
  }, [interactions]);

  const selectedInteraction = useMemo(
    () => interactions?.find((i) => i.id === selectedInteractionID),
    [selectedInteractionID, interactions]
  );

  return (
    <div className="interactions">
      <Paper
        className="sidebar"
        withBorder
        sx={(theme) => ({ backgroundColor: useBackgroundColor(theme) })}
      >
        <InteractionSidebar />
      </Paper>
      {selectedInteraction && (
        <div className="selected-interaction main-content">
          <SelectedInteraction interaction={selectedInteraction} />
        </div>
      )}
    </div>
  );
};

export default InteractionsTab;
