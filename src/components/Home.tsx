import React from "react";
import useModal from "src/hooks/useModal";

const Home: React.FC = () => {
  const OptionsModal = useModal({ name: "options-modal" });

  return (
    <>
      <h1>Home</h1>
      <button onClick={OptionsModal.show}>hi</button>
      <OptionsModal.Component>
        <h1>hi</h1>
      </OptionsModal.Component>
    </>
  );
};

export default Home;
