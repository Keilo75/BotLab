import { IconMessages, IconSettings, IconTerminal2 } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tab from "src/components/ui/tabs/Tab";
import Tabs from "src/components/ui/tabs/Tabs";
import { MenuAction } from "src/models/menu-action";
import { ProjectSettings } from "src/models/project";
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
  const [settings, setSettings] = useState<ProjectSettings>();

  // Load project
  useEffect(() => {
    if (!projectPath) return;

    window.fs.getProjectFromBotFile(projectPath).then((project) => {
      dispatchProjects({
        type: "add",
        project: { name: project.settings.name, path: projectPath },
      });

      setSettings(project.settings);
    });
  }, []);

  // Handle menu action
  useEffect(() => {
    switch (menuAction) {
      case MenuAction.CLOSE_EDITOR:
        navigate("/");
        break;

      case MenuAction.SAVE:
        if (!settings) return;

        break;
    }

    setMenuAction(undefined);
  }, [menuAction]);

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
