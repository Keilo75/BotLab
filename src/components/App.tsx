import React, { useCallback } from "react";
import "styles/_themes.scss";
import "styles/_globals.scss";
import "styles/_variables.scss";
import "styles/_ui.scss";
import TitleBar from "./ui/title-bar/TitleBar";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Modal from "./ui/Modal";
import { MenuAction } from "src/models/menu-action";
import useModal from "src/hooks/useModal";
import OptionsModalComponent from "./modals/OptionsModal";

const App: React.FC = () => {
  const OptionsModal = useModal({ name: "options-modal", large: true });

  const handleMenuItemClick = (action: MenuAction) => {
    const mainProcessActions = [MenuAction.EXIT, MenuAction.TOGGLE_DEV_TOOLS];
    if (mainProcessActions.includes(action)) {
      window.ipc.handleTitleBarAction(action);
    }

    switch (action) {
      case MenuAction.OPTIONS:
        OptionsModal.show();
        break;
    }
  };

  return (
    <>
      <TitleBar handleMenuItemClick={handleMenuItemClick} />
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </main>
      <OptionsModalComponent modal={OptionsModal} />
      <Modal />
    </>
  );
};

export default App;
