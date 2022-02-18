import React, { useCallback, useEffect, useReducer, useState } from "react";
import "styles/_themes.scss";
import "styles/_globals.scss";
import "styles/_variables.scss";
import "styles/_ui.scss";
import TitleBar from "./shared/title-bar/TitleBar";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./views/home/Home";
import Modal from "./ui/Modal";
import { MenuAction } from "src/models/menu-action";
import OptionsModal from "./modals/OptionsModal";
import { OptionsStore } from "src/stores/OptionsStore";
import ErrorModal from "./modals/ErrorModal";
import { ModalName } from "src/models/modal-name";
import { projectReducer } from "src/stores/ProjectReducer";
import { ModalStore } from "src/stores/ModalStore";
import { ProjectInfo } from "src/models/project";
import Editor from "./views/editor/Editor";
import InfoBar from "./shared/InfoBar";

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [menuAction, setMenuAction] = useState<MenuAction | undefined>(undefined);

  const [options, setOptions] = OptionsStore(
    useCallback((state) => [state.options, state.setOptions], [])
  );

  const [projects, dispatchProjects] = useReducer(projectReducer, []);
  const [setCurrentModal] = ModalStore(useCallback((state) => [state.setCurrentModal], []));

  useEffect(() => {
    async function loadProjects() {
      const projectPaths = window.store.getProjects();
      const projects: ProjectInfo[] = [];

      for (const projectPath of projectPaths) {
        try {
          const project = await window.project.getProjectFromBotFile(projectPath);
          projects.push({ name: project.settings.name, path: projectPath });
        } catch {
          dispatchProjects({ type: "remove", projectPath });
        }
      }

      dispatchProjects({ type: "set", projects });
      setLoaded(true);
    }

    setOptions(window.store.getOptions());
    loadProjects();
  }, []);

  useEffect(() => {
    window.store.setProjects(projects.map((p) => p.path));
  }, [projects]);

  useEffect(() => {
    if (!options) return;

    // Change theme
    document.body.classList.toggle("theme-dark", options.general.theme == 0);

    window.store.setOptions(options);
  }, [options]);

  const handleMenuItemClick = (action: MenuAction) => {
    const mainProcessActions = [MenuAction.EXIT, MenuAction.TOGGLE_DEV_TOOLS];
    if (mainProcessActions.includes(action)) {
      return window.ipc.handleTitleBarAction(action);
    }

    const editorActions = [MenuAction.SAVE, MenuAction.CLOSE_EDITOR];
    if (editorActions.includes(action)) {
      return setMenuAction(action);
    }

    switch (action) {
      case MenuAction.OPTIONS:
        setCurrentModal(ModalName.OPTIONS);
        break;

      case MenuAction.RELOAD:
        window.location.reload();
        break;
    }
  };

  if (!loaded) return null;
  return (
    <>
      <HashRouter>
        <TitleBar handleMenuItemClick={handleMenuItemClick} />
        <main>
          <Routes>
            <Route
              path="/"
              element={<Home projects={projects} dispatchProjects={dispatchProjects} />}
            />
            <Route
              path="editor/:projectPath"
              element={
                <Editor
                  menuAction={menuAction}
                  setMenuAction={setMenuAction}
                  dispatchProjects={dispatchProjects}
                />
              }
            />
          </Routes>
        </main>
        <InfoBar />
      </HashRouter>
      <OptionsModal />
      <ErrorModal />
      <Modal />
    </>
  );
};

export default App;
