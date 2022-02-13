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
import OptionsModal from "./modals/OptionsModal";
import { OptionsStore } from "src/stores/OptionsStore";
import ErrorModal from "./modals/ErrorModal";
import { ModalName } from "src/models/modal-name";
import { ProjectStore } from "src/stores/ProjectStore";
import AboutModal from "./modals/AboutModal";
import { ModalStore } from "src/stores/ModalStore";
import { ProjectInfo } from "src/models/project";

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  const [options, setOptions] = OptionsStore(
    useCallback((state) => [state.options, state.setOptions], [])
  );
  const [projects, setProjects, removeProject] = ProjectStore(
    useCallback((state) => [state.projects, state.setProjects, state.removeProject], [])
  );
  const setCurrentModal = ModalStore(useCallback((state) => state.setCurrentModal, []));

  useEffect(() => {
    async function loadProjects() {
      const projectPaths = window.store.getProjects();
      const projects: ProjectInfo[] = [];

      for (const projectPath of projectPaths) {
        try {
          const name = await window.fs.getNameFromBotFile(projectPath);
          projects.push({ name, path: projectPath });
        } catch {
          removeProject(projectPath);
        }
      }

      setProjects(projects);
      setLoaded(true);
    }

    setOptions(window.store.getOptions());
    loadProjects();
  }, []);

  useEffect(() => {
    window.store.setProjects(projects.map((p) => p.path));
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
        setCurrentModal(ModalName.OPTIONS);
        break;

      case MenuAction.ABOUT:
        setCurrentModal(ModalName.ABOUT);
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
      <OptionsModal />
      <ErrorModal />
      <AboutModal />
      <Modal />
    </>
  );
};

export default App;
