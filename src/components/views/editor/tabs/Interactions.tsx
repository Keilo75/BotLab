import React from "react";
import { Interaction } from "src/models/project";
import InteractionList from "./interactions/interaction-list/InteractionList";

interface Props {
  interactions: Interaction[];
  setInteractions: React.Dispatch<React.SetStateAction<Interaction[]>>;
}

const Interactions: React.FC<Props> = ({ interactions, setInteractions }) => {
  return (
    <>
      <div className="sidebar">
        <InteractionList interactions={interactions} />
      </div>
      <div className="interaction"></div>
    </>
  );
};

export default Interactions;
