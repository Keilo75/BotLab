import React from "react";
import Button from "src/components/ui/inputs/Button";
import DropdownButton from "src/components/ui/inputs/DropdownButton";
import Label from "src/components/ui/Label";
import { ProjectInteraction } from "src/models/project";

interface Props {
  interactions: ProjectInteraction[];
  setInteractions: React.Dispatch<React.SetStateAction<ProjectInteraction[]>>;
}

const Interactions: React.FC<Props> = ({ interactions, setInteractions }) => {
  const handleAddInteraction = (type: string) => {
    console.log(type);
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-head">
          <Label text="Interactions" />
          <DropdownButton
            text="Add Interaction"
            options={["Command", "Command Group"]}
            onClick={handleAddInteraction}
            className="add-button"
          />
        </div>
      </div>
      <div className="interaction"></div>
    </>
  );
};

export default Interactions;
