import { ScrollArea, Tabs } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InfoBar from "src/components/shared/InfoBar";
import useLogs from "src/hooks/useLogs";
import useStacktrace from "src/hooks/useStacktrace";
import { sleep } from "src/lib/sleep";
import { validateProject, validateProjectName } from "src/lib/validater";
import { BotStatus } from "src/models/bot";
import { MenuAction } from "src/models/menu-action";
import { Project } from "src/models/project";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";
import { ISettingsStore, SettingsStore } from "src/stores/project-stores/SettingsStore";
import { ProjectAction } from "src/stores/ProjectReducer";
import { Messages, Terminal2, Settings } from "tabler-icons-react";
import DashboardTab from "./tabs/DashboardTab";
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
  if (!projectPath) return null;

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useInputState(2);
  const { setInfoMessage, setTitlebar } = InfoStore(InfoActions);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [logs, logsHandler] = useLogs();
  const [botStatus, setBotStatus] = useState<BotStatus>("offline");

  const setSettings = SettingsStore(SettingsSelector);
  const { setInteractions, selectInteraction } = InteractionStore(InteractionActions);

  // Load project
  useEffect(() => {
    if (!projectPath) return;

    window.project.getProjectFromBotFile(projectPath).then(async (project) => {
      dispatchProjects({
        type: "add",
        project: { name: project.settings.name, path: projectPath },
      });

      setSettings(project.settings);
      setInteractions(project.interactions);
      setTitlebar({ title: project.settings.name, dirty: false });

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

  useStacktrace("interaction", ({ id }) => {
    setActiveTab(0);
    selectInteraction(id);
  });

  const saveProject = async (): Promise<Project | void> => {
    const settings = SettingsStore.getState().settings;
    const interactions = InteractionStore.getState().interactions;
    if (!settings || !interactions) return;

    const project: Project = { settings, interactions };

    setInfoMessage("Saving...", "loading");
    await sleep(100);

    const projectNameError = validateProjectName(settings.name);
    if (projectNameError)
      return setInfoMessage("Could not save. Project Name: " + projectNameError, "error");

    try {
      await window.project.saveProject(project, projectPath);
    } catch (err) {
      return setInfoMessage("Could not save: " + err, "error");
    }

    setInfoMessage("Saved succesfully", "success");
    setTitlebar({ title: settings.name, dirty: false });

    return project;
  };

  const setupBotFolder = async () => {
    logsHandler.add({ status: "error", message: "Environment not setup" });

    const actions = [
      { message: "Check npm installation", action: window.bot.isNpmInstalled },
      { message: "Copy files", action: window.bot.copyFiles },
      { message: "Install dependencies", action: window.bot.installDependencies },
    ];

    for (const action of actions) {
      logsHandler.add({ message: action.message });
      const isSuccesfull = await action.action(projectPath);
      if (!isSuccesfull) throw new Error();
      logsHandler.update({ status: "success" });
    }
  };

  const startBot = async () => {
    const project = await saveProject();
    if (!project) return;

    setBotStatus("starting");

    const isBotFolderSetup = await window.bot.isBotFolderSetUp(projectPath);
    if (!isBotFolderSetup)
      try {
        await setupBotFolder();
      } catch {
        logsHandler.update({ status: "error" });
        setBotStatus("offline");
        return;
      }

    logsHandler.add({ message: "Validate project" });
    const errors = validateProject(project);
    if (errors.length > 0) {
      logsHandler.update({ status: "error", errors });
      setBotStatus("offline");
      return;
    }
    logsHandler.update({ status: "success" });

    logsHandler.add({ message: "Compile bot" });
    try {
      await window.bot.compileBot(projectPath, project);
    } catch {
      logsHandler.update({ status: "error" });
      setBotStatus("offline");
      return;
    }

    console.log("Compiled");
    setBotStatus("offline");
  };

  if (!hasLoaded) return null;

  return (
    <>
      <Tabs
        position="center"
        className="editor-tabs"
        tabPadding={0}
        active={activeTab}
        onTabChange={setActiveTab}
      >
        <Tabs.Tab label="Interactions" icon={<Messages size={14} />}>
          <InteractionsTab />
        </Tabs.Tab>
        <Tabs.Tab label="Settings" icon={<Settings size={14} />}>
          <ScrollArea sx={{ height: "100%" }}>
            <SettingsTab />
          </ScrollArea>
        </Tabs.Tab>
        <Tabs.Tab label="Dashboard" icon={<Terminal2 size={14} />}>
          <ScrollArea sx={{ height: "100%" }}>
            <DashboardTab
              logs={logs}
              logsHandler={logsHandler}
              startBot={startBot}
              botStatus={botStatus}
            />
          </ScrollArea>
        </Tabs.Tab>
      </Tabs>
      <InfoBar />
    </>
  );
};

export default Editor;
