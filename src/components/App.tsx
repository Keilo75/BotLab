import React, { useCallback, useEffect, useState } from "react";
import "styles/_themes.scss";
import "styles/_globals.scss";
import "styles/_variables.scss";
import "styles/_ui.scss";
import TitleBar from "./ui/title-bar/TitleBar";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./views/home/Home";
import Modal from "./ui/Modal";
import { MenuAction } from "src/models/menu-action";
import useModal from "src/hooks/useModal";
import OptionsModalComponent from "./modals/OptionsModal";
import { OptionsStore } from "src/stores/OptionsStore";
import ErrorModal from "./modals/ErrorModal";
import { ModalName } from "src/models/modal-name";
import { ProjectStore } from "src/stores/ProjectStore";

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  const OptionsModal = useModal({ name: ModalName.OPTIONS, large: true });
  const [options, setOptions] = OptionsStore(
    useCallback((state) => [state.options, state.setOptions], [])
  );
  const [projects, setProjects] = ProjectStore(
    useCallback((state) => [state.projects, state.setProjects], [])
  );

  useEffect(() => {
    setOptions(window.store.getOptions());
    setProjects(window.store.getProjects());

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.store.setProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (options !== undefined) {
      // Change theme
      document.body.classList.toggle("theme-dark", options.general.theme == 0);

      window.store.setOptions(options);
    }
  }, [options]);

  const handleMenuItemClick = (action: MenuAction) => {
    const mainProcessActions = [MenuAction.EXIT, MenuAction.TOGGLE_DEV_TOOLS];
    if (mainProcessActions.includes(action)) {
      return window.ipc.handleTitleBarAction(action);
    }

    switch (action) {
      case MenuAction.OPTIONS:
        OptionsModal.show();
        break;
    }
  };

  if (!loaded) return null;
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
      <ErrorModal />
      <Modal />
    </>
  );
};

export default App;
