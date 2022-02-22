import React, { useCallback, useEffect, useReducer, useState } from "react";
import "styles/_themes.scss";
import "styles/_globals.scss";
import "styles/_variables.scss";
import "styles/_ui.scss";
import TitleBar from "./shared/title-bar/TitleBar";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./views/home/Home";
import ModalTemplate, { Modal } from "./ui/Modal";
import { MenuAction } from "src/models/menu-action";
import OptionsModal from "./modals/OptionsModal";
import { OptionsStore } from "src/stores/OptionsStore";
import ErrorModal from "./modals/ErrorModal";
import { projectReducer } from "src/stores/ProjectReducer";
import { ModalName, ModalStore } from "src/stores/ModalStore";
import { ProjectInfo } from "src/models/project";
import Editor from "./views/editor/Editor";
import ContextMenu from "./shared/ContextMenu";

const App: React.FC = () => {
  const [menuAction, setMenuAction] = useState<MenuAction | undefined>(undefined);

  const [options, setOptions] = OptionsStore(
    useCallback((state) => [state.options, state.setOptions], [])
  );

  const [projects, dispatchProjects] = useReducer(projectReducer, []);
  const setCurrentModal = ModalStore(useCallback((state) => state.setCurrentModal, []));

  const loadProjects = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    setOptions(window.store.getOptions());
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

    const editorActions = [MenuAction.SAVE, MenuAction.CLOSE_EDITOR, MenuAction.OPEN_IN_EXPLORER];
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

  return (
    <>
      <HashRouter>
        <TitleBar handleMenuItemClick={handleMenuItemClick} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  projects={projects}
                  dispatchProjects={dispatchProjects}
                  loadProjects={loadProjects}
                />
              }
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
      </HashRouter>
      <ContextMenu />
      <Modal name={ModalName.OPTIONS} large>
        <OptionsModal />
      </Modal>
      <Modal name={ModalName.ERROR}>
        <ErrorModal />
      </Modal>
      <ModalTemplate />
    </>
  );
};

export default App;
