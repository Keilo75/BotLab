import React from "react";
import TextInput from "src/components/ui/inputs/TextInput";
import Label from "src/components/ui/Label";
import ComponentGroup from "src/components/ui/utils/ComponentGroup";
import { Interaction, InteractionTypes } from "src/models/interactions";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";

const InteractionActions = (state: IInteractionStore) => state.actions;
interface Props {
  interaction: Interaction;
}

const SelectedInteraction: React.FC<Props> = ({ interaction }) => {
  const { updateSelectedInteraction } = InteractionStore(InteractionActions);

  const handleDescriptionChange = (value: string) => {
    updateSelectedInteraction("description", value);
  };

  return (
    <>
      <h2 className="no-margin">{interaction.name}</h2>
      <span className="text">{InteractionTypes[interaction.type]}</span>
      <ComponentGroup axis="vertical" className="mt">
        {interaction.description !== undefined && (
          <div>
            <Label text="Description" />
            <TextInput
              name="description"
              value={interaction.description}
              onChange={handleDescriptionChange}
            />
          </div>
        )}
      </ComponentGroup>
    </>
  );
};

export default SelectedInteraction;
