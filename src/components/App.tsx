import React, { useCallback } from "react";
import "styles/_themes.scss";
import "styles/_globals.scss";
import "styles/_variables.scss";
import "styles/_ui.scss";
import TitleBar from "./ui/title-bar/TitleBar";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Modal from "./ui/Modal";
import { MenuAction } from "src/@types/index.d";
import useModal, { ModalLayout } from "src/hooks/useModal";
import Button from "./ui/button/Button";
import Tabs from "./ui/tabs/Tabs";
import Tab from "./ui/tabs/Tab";

const App: React.FC = () => {
  const OptionsModal = useModal({ name: "options-modal", large: true });

  const handleMenuItemClick = (action: MenuAction) => {
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
      <OptionsModal.Component>
        <ModalLayout.Content>
          <Tabs name="Options">
            <Tab name="General"></Tab>
            <Tab name="Editor"></Tab>
            <Tab name="About"></Tab>
          </Tabs>
        </ModalLayout.Content>
        <ModalLayout.Footer>
          <Button text="Close" type="primary" onClick={OptionsModal.hide} />
        </ModalLayout.Footer>
      </OptionsModal.Component>
      <Modal />
    </>
  );
};

export default App;
