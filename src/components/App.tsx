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
import { IOptionsStore, OptionsStore } from "src/stores/OptionsStore";
import ErrorModal from "./modals/ErrorModal";
import { projectReducer } from "src/stores/ProjectReducer";
import { IModalStore, ModalStore } from "src/stores/ModalStore";
import { ModalName } from "src/models/modals";
import { ProjectInfo } from "src/models/project";
import Editor from "./views/editor/Editor";
import ContextMenu from "./shared/ContextMenu";
import ConfirmationModal from "./modals/ConfirmationModal";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const ModalActions = (state: IModalStore) => state.actions;
const Options = (state: IOptionsStore) => state.options;
const OptionsActions = (state: IOptionsStore) => state.actions;

const App: React.FC = () => {
  const [menuAction, setMenuAction] = useState<MenuAction | undefined>(undefined);

  const options = OptionsStore(Options);
  const optionsActions = OptionsStore(OptionsActions);

  const [projects, dispatchProjects] = useReducer(projectReducer, []);
  const { setCurrentModal } = ModalStore(ModalActions);

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
    optionsActions.setOptions(window.store.getOptions());
  }, []);

  useEffect(() => {
    window.store.setProjects(projects.map((p) => p.path));
  }, [projects]);

  useEffect(() => {
    if (!options) return;

    // Change theme

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
    <MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles>
      <ModalsProvider>
        <NotificationsProvider>
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
          <Modal name={ModalName.CONFIRMATION}>
            <ConfirmationModal />
          </Modal>
          <ModalTemplate />
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
