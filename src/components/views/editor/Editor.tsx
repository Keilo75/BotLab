import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tab from "src/components/ui/tabs/Tab";
import Tabs from "src/components/ui/tabs/Tabs";
import { MenuAction } from "src/models/menu-action";
import { ProjectAction } from "src/stores/ProjectReducer";

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
    if (menuAction !== undefined) {
      switch (menuAction) {
        case MenuAction.CLOSE_EDITOR:
          navigate("/");
          break;
      }

      setMenuAction(undefined);
    }
  }, [menuAction]);

  return (
    <Tabs name="Editor" axis="horizontal">
      <Tab name="Commands"></Tab>
      <Tab name="Settings"></Tab>
    </Tabs>
  );
};

export default Editor;
