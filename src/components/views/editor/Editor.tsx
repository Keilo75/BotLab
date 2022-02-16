import { IconMessages, IconSettings, IconTerminal2 } from "@tabler/icons";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tab from "src/components/ui/tabs/Tab";
import Tabs from "src/components/ui/tabs/Tabs";
import { MenuAction } from "src/models/menu-action";
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

  useEffect(() => {
    if (projectPath)
      window.fs.getProjectFromBotFile(projectPath).then((project) => {
        dispatchProjects({
          type: "add",
          project: { name: project.settings.name, path: projectPath },
        });
      });
  }, []);

  useEffect(() => {
    switch (menuAction) {
      case MenuAction.CLOSE_EDITOR:
        navigate("/");
        break;
    }

    setMenuAction(undefined);
  }, [menuAction]);

  return (
    <Tabs name="Editor" axis="horizontal" defaultTab={1}>
      <Tab name="Interactions" icon={IconMessages}></Tab>
      <Tab name="Settings" icon={IconSettings}>
        <Settings />
      </Tab>
      <Tab name="Dashboard" icon={IconTerminal2}></Tab>
    </Tabs>
  );
};

export default Editor;
