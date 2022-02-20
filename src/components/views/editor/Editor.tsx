import { IconMessages, IconSettings, IconTerminal2 } from "@tabler/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InfoBar from "src/components/shared/InfoBar";
import Tab from "src/components/ui/tabs/Tab";
import Tabs from "src/components/ui/tabs/Tabs";
import { getProjectNameError } from "src/lib/getProjectNameError";
import { sleep } from "src/lib/sleep";
import { MenuAction } from "src/models/menu-action";
import { ProjectSettings, Interaction } from "src/models/project";
import { InfoStore } from "src/stores/InfoStore";
import { SettingsStore } from "src/stores/project-stores/SettingsStore";
import { ProjectAction } from "src/stores/ProjectReducer";
import Interactions from "./tabs/Interactions";
import Settings from "./tabs/Settings";

interface Props {
  menuAction: MenuAction | undefined;
  setMenuAction: React.Dispatch<React.SetStateAction<MenuAction | undefined>>;
  dispatchProjects: React.Dispatch<ProjectAction>;
}
const Editor: React.FC<Props> = ({ menuAction, setMenuAction, dispatchProjects }) => {
  const { projectPath } = useParams();
  const navigate = useNavigate();
  const [setInfoMessage, setTitle, setDirty] = InfoStore(
    useCallback((state) => [state.setInfoMessage, state.setTitle, state.setDirty], [])
  );
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const hasProjectLoaded = useRef(false);

  const setSettings = SettingsStore(useCallback((state) => state.setSettings, []));

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

      hasProjectLoaded.current = true;
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

    if (!settings || !interactions || !projectPath) return;

    setInfoMessage("Saving...", "loading");
    await sleep(100);

    const projectNameError = getProjectNameError(settings.name);
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

  return (
    <>
      <Tabs name="Editor" axis="horizontal" defaultTab={0}>
        <Tab name="Interactions" icon={IconMessages} fullscreen className="interactions">
          <Interactions interactions={interactions} setInteractions={setInteractions} />
        </Tab>
        <Tab name="Settings" icon={IconSettings}>
          <Settings />
        </Tab>
        <Tab name="Dashboard" icon={IconTerminal2}></Tab>
      </Tabs>
      <InfoBar />
    </>
  );
};

export default Editor;
