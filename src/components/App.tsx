import React, { useCallback, useEffect, useReducer, useState } from "react";
import "styles/_globals.scss";
import "styles/_variables.scss";
import "styles/_ui.scss";
import TitleBar from "./shared/title-bar/TitleBar";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./views/home/Home";
import { MenuAction } from "src/models/menu-action";
import { IOptionsStore, OptionsStore } from "src/stores/OptionsStore";
import { projectReducer } from "src/stores/ProjectReducer";
import { ProjectInfo } from "src/models/project";
import Editor from "./views/editor/Editor";
import ContextMenu from "./shared/ContextMenu";
import { MantineProvider, Modal } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import OptionsModalComponent from "./modals/OptionsModal";
import { useDisclosure } from "@mantine/hooks";

const Options = (state: IOptionsStore) => state.options;
const OptionsActions = (state: IOptionsStore) => state.actions;

const App: React.FC = () => {
  const [menuAction, setMenuAction] = useState<MenuAction | undefined>(undefined);

  const options = OptionsStore(Options);
  const optionsActions = OptionsStore(OptionsActions);
  const [optionsModalOpened, optionsModalHandler] = useDisclosure(false);

  const [projects, dispatchProjects] = useReducer(projectReducer, []);

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
    document.body.classList.toggle("dark-theme", options["general.theme"] === "dark");

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
        optionsModalHandler.open();
        break;

      case MenuAction.RELOAD:
        window.location.reload();
        break;
    }
  };

  return (
    <MantineProvider
      theme={{ colorScheme: options?.["general.theme"] }}
      defaultProps={{
        Card: { shadow: "md" },
        ScrollArea: { type: "auto" },
        Overlay: { opacity: 0.6, color: "#000" },
        Tooltip: { transition: "pop" },
      }}
      withGlobalStyles
      withCSSVariables
    >
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

          <Modal
            opened={optionsModalOpened}
            onClose={optionsModalHandler.close}
            centered
            title="Options"
            size="800px"
          >
            <OptionsModalComponent close={optionsModalHandler.close} />
          </Modal>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
