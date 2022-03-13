import { IconPlus } from "@tabler/icons";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "src/components/ui/Modal";
import { fileExtensionWithoutDot } from "src/models/file-extension";
import { ProjectInfo } from "src/models/project";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { IModalStore, ModalStore } from "src/stores/ModalStore";
import { ModalName } from "src/models/modals";
import { ProjectAction } from "src/stores/ProjectReducer";
import CreateProjectModalComponent from "../../modals/CreateProjectModal";
import Button from "../../ui/inputs/Button";
import ComponentGroup from "../../ui/utils/ComponentGroup";

const InfoActions = (state: IInfoStore) => state.actions;
const ModalActions = (state: IModalStore) => state.actions;

interface Props {
  projects: ProjectInfo[];
  dispatchProjects: React.Dispatch<ProjectAction>;
  loadProjects: () => Promise<void>;
}

const Home: React.FC<Props> = ({ projects, dispatchProjects, loadProjects }) => {
  const { setCurrentModal } = ModalStore(ModalActions);
  const { setTitle, setDirty } = InfoStore(InfoActions);

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
    setTitle("BotLab", true);
    setDirty(false);
  }, []);

  const handleOpenProject = async () => {
    const response = await window.fs.openDialog({
      title: "Open Project",
      filters: [{ name: "BotLab Files", extensions: [fileExtensionWithoutDot] }],
    });
    if (response.canceled) return;

    const projectPath = response.filePaths[0];
    openProject(projectPath);
  };

  const handleProjectClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    const projectPath = e.currentTarget.getAttribute("data-path");
    if (!projectPath) return;

    if (e.type === "click") {
      openProject(projectPath);
    }

    if (e.type === "keydown") {
      const key = (e as React.KeyboardEvent).key;
      if (key === "Enter" || key === " ") openProject(projectPath);
    }
  };

  const openProject = async (projectPath: string) => {
    try {
      await window.project.getProjectFromBotFile(projectPath);
      navigate(`editor/${projectPath}`);
    } catch {
      setCurrentModal(ModalName.ERROR, "Could not find file.");
      dispatchProjects({ type: "remove", projectPath });
    }
  };

  const showCreateProjectModal = () => {
    setCurrentModal(ModalName.CREATE_NEW_PROJECT);
  };

  return (
    <div className="main-content">
      <h2>Projects</h2>
      <ComponentGroup axis="horizontal" className="mb">
        <Button
          text="Create Project"
          type="success"
          icon={IconPlus}
          onClick={showCreateProjectModal}
        />
        <Button text="Open Project" type="primary" onClick={handleOpenProject} />
      </ComponentGroup>
      <hr />
      <div className="project-list mt">
        {projects.slice(0, 10).map((project, index) => (
          <div key={index}>
            <span
              className="link"
              data-path={project.path}
              onClick={handleProjectClick}
              onKeyDown={handleProjectClick}
              tabIndex={0}
            >
              {project.name}
            </span>
            <span className="project-path"> {project.path}</span>
          </div>
        ))}
      </div>
      <Modal name={ModalName.CREATE_NEW_PROJECT}>
        <CreateProjectModalComponent dispatchProjects={dispatchProjects} />
      </Modal>
    </div>
  );
};

export default Home;
