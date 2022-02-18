import { IconMessages, IconSettings, IconTerminal2 } from "@tabler/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tab from "src/components/ui/tabs/Tab";
import Tabs from "src/components/ui/tabs/Tabs";
import { getProjectNameError } from "src/lib/getProjectNameError";
import { MenuAction } from "src/models/menu-action";
import { ProjectSettings } from "src/models/project";
import { InfoBarStore } from "src/stores/InfoBarStore";
import { ProjectAction } from "src/stores/ProjectReducer";
import Settings from "./tabs/Settings";

interface Props {
  menuAction: MenuAction | undefined;
  setMenuAction: React.Dispatch<React.SetStateAction<MenuAction | undefined>>;
  dispatchProjects: React.Dispatch<ProjectAction>;
}
const Editor: React.FC<Props> = ({ menuAction, setMenuAction, dispatchProjects }) => {
  const { projectPath } = useParams();
  const navigate = useNavigate();
  const setInfoMessage = InfoBarStore(useCallback((state) => state.setInfoMessage, []));
  const [settings, setSettings] = useState<ProjectSettings>();

  // Load project
  useEffect(() => {
    if (!projectPath) return;

    window.project.getProjectFromBotFile(projectPath).then((project) => {
      dispatchProjects({
        type: "add",
        project: { name: project.settings.name, path: projectPath },
      });

      setSettings(project.settings);
    });
  }, []);

  // Handle menu action
  useEffect(() => {
    if (!menuAction) return;

    switch (menuAction) {
      case MenuAction.CLOSE_EDITOR:
        navigate("/");
        break;

      case MenuAction.SAVE:
        saveProject();

        break;
    }

    setMenuAction(undefined);
  }, [menuAction]);

  const saveProject = async () => {
    if (!settings || !projectPath) return;

    setInfoMessage("Saving...", "loading");

    const projectNameError = getProjectNameError(settings.name);
    if (projectNameError)
      return setInfoMessage("Could not save. Project Name: " + projectNameError, "error");

    try {
      await window.project.saveProject({ settings, commands: [] }, projectPath);
    } catch (err) {
      return setInfoMessage("Could not save: " + err, "error");
    }

    setInfoMessage("Saved succesfully", "success");
  };

  if (!settings) return null;

  return (
    <Tabs name="Editor" axis="horizontal" defaultTab={1}>
      <Tab name="Interactions" icon={IconMessages}></Tab>
      <Tab name="Settings" icon={IconSettings}>
        <Settings settings={settings} setSettings={setSettings} />
      </Tab>
      <Tab name="Dashboard" icon={IconTerminal2}></Tab>
    </Tabs>
  );
};

export default Editor;
