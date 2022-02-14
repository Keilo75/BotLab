import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tab from "src/components/ui/tabs/Tab";
import Tabs from "src/components/ui/tabs/Tabs";
import { MenuAction } from "src/models/menu-action";
import { ProjectStore } from "src/stores/ProjectStore";

interface Props {
  menuAction: MenuAction | undefined;
  setMenuAction: React.Dispatch<React.SetStateAction<MenuAction | undefined>>;
}
const Editor: React.FC<Props> = ({ menuAction, setMenuAction }) => {
  const { projectPath } = useParams();
  const navigate = useNavigate();

  const [addProject] = ProjectStore(useCallback((state) => [state.addProject], []));

  useEffect(() => {
    if (projectPath)
      window.fs.getProjectFromBotFile(projectPath).then((project) => {
        console.log(project);
        addProject({ name: project.settings.name, path: projectPath });
      });
  }, []);

  useEffect(() => {
    if (menuAction !== undefined) {
      switch (menuAction) {
        case MenuAction.CLOSE_EDITOR:
          navigate("/");
          break;

        case MenuAction.SAVE:
          console.log("save");
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
