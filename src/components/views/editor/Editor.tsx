import { Tabs } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InfoBar from "src/components/shared/InfoBar";
import { sleep } from "src/lib/sleep";
import { validateProjectName } from "src/lib/validater";
import { MenuAction } from "src/models/menu-action";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";
import { ISettingsStore, SettingsStore } from "src/stores/project-stores/SettingsStore";
import { ProjectAction } from "src/stores/ProjectReducer";
import { Messages, Terminal2, Settings } from "tabler-icons-react";
import InteractionsTab from "./tabs/InteractionsTab";
import SettingsTab from "./tabs/SettingsTab";

const InfoActions = (state: IInfoStore) => state.actions;
const InteractionActions = (state: IInteractionStore) => state.actions;
const SettingsSelector = (state: ISettingsStore) => state.setSettings;

interface Props {
  menuAction: MenuAction | undefined;
  setMenuAction: React.Dispatch<React.SetStateAction<MenuAction | undefined>>;
  dispatchProjects: React.Dispatch<ProjectAction>;
}

const Editor: React.FC<Props> = ({ menuAction, setMenuAction, dispatchProjects }) => {
  const { projectPath } = useParams();
  const navigate = useNavigate();
  const { setInfoMessage, setDirty, setTitle } = InfoStore(InfoActions);
  const [hasLoaded, setHasLoaded] = useState(false);

  const setSettings = SettingsStore(SettingsSelector);
  const { setInteractions } = InteractionStore(InteractionActions);

  // Load project
  useEffect(() => {
    if (!projectPath) return;

    window.project.getProjectFromBotFile(projectPath).then((project) => {
      dispatchProjects({
        type: "add",
        project: { name: project.settings.name, path: projectPath },
      });

      setSettings(project.settings);
      setInteractions(project.interactions);
      setTitle(project.settings.name);

      setHasLoaded(true);
    });
  }, []);

  // Handle menu action
  useEffect(() => {
    if (!menuAction) return;

    switch (menuAction) {
      case MenuAction.CLOSE_EDITOR:
        navigate("/");
        break;

      case MenuAction.OPEN_IN_EXPLORER:
        if (projectPath) window.project.openProjectInExplorer(projectPath);
        break;

      case MenuAction.SAVE:
        saveProject();

        break;
    }

    setMenuAction(undefined);
  }, [menuAction]);

  const saveProject = async () => {
    const settings = SettingsStore.getState().settings;
    const interactions = InteractionStore.getState().interactions;

    if (!settings || !interactions || !projectPath) return;

    setInfoMessage("Saving...", "loading");
    await sleep(100);

    const projectNameError = validateProjectName(settings.name);
    if (projectNameError)
      return setInfoMessage("Could not save. Project Name: " + projectNameError, "error");

    try {
      await window.project.saveProject({ settings, interactions }, projectPath);
    } catch (err) {
      return setInfoMessage("Could not save: " + err, "error");
    }

    setInfoMessage("Saved succesfully", "success");
    setTitle(settings.name);
    setDirty(false);
  };

  if (!hasLoaded) return null;

  return (
    <>
      <Tabs position="center" className="editor-tabs" tabPadding={0}>
        <Tabs.Tab label="Interactions" icon={<Messages size={14} />}>
          <InteractionsTab />
        </Tabs.Tab>
        <Tabs.Tab label="Settings" icon={<Settings size={14} />}>
          <SettingsTab />
        </Tabs.Tab>
        <Tabs.Tab label="Dashboard" icon={<Terminal2 size={14} />}></Tabs.Tab>
      </Tabs>

      <InfoBar />
    </>
  );
};

export default Editor;
