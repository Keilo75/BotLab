import React from "react";
import InteractionList from "./interactions/interaction-list/InteractionList";

const Interactions: React.FC = () => {
  return (
    <>
      <div className="sidebar">
        <InteractionList />
      </div>
      <div className="interaction"></div>
    </>
  );
};

export default Interactions;
