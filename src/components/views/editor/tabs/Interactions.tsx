import React from "react";
import { ProjectInteraction } from "src/models/project";

interface Props {
  interactions: ProjectInteraction[];
  setInteractions: React.Dispatch<React.SetStateAction<ProjectInteraction[]>>;
}

const Interactions: React.FC<Props> = ({ interactions, setInteractions }) => {
  return null;
};

export default Interactions;
