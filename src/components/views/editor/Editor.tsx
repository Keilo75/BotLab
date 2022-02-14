import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuAction } from "src/models/menu-action";

interface Props {
  menuAction: MenuAction | undefined;
  setMenuAction: React.Dispatch<React.SetStateAction<MenuAction | undefined>>;
}
const Editor: React.FC<Props> = ({ menuAction, setMenuAction }) => {
  const { projectPath } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (projectPath)
      window.fs.getProjectFromBotFile(projectPath).then((project) => console.log(project));
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
    <div className="tab-content">
      <h2>Editor</h2>
    </div>
  );
};

export default Editor;
