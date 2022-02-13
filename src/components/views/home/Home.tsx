import { IconPlus } from "@tabler/icons";
import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import useModal from "src/hooks/useModal";
import { fileExtensionWithoutDot } from "src/models/file-extension";
import { ModalName } from "src/models/modal-name";
import { ModalStore } from "src/stores/ModalStore";
import { ProjectStore } from "src/stores/ProjectStore";
import CreateProjectModalComponent from "../../modals/CreateProjectModal";
import Button from "../../ui/inputs/Button";
import ComponentGroup from "../../ui/utils/ComponentGroup";

const Home: React.FC = () => {
  const CreateProjectModal = useModal({ name: ModalName.CREATE_NEW_PROJECT });
  const [projects, addProject, removeProject] = ProjectStore(
    useCallback((state) => [state.projects, state.addProject, state.removeProject], [])
  );
  const [openErrorModal] = ModalStore(useCallback((state) => [state.openErrorModal], []));

  useEffect(() => {
    //CreateProjectModal.show();
  }, []);

  const handleAddProject = async () => {
    const response = await window.fs.openDialog({
      title: "Add Project",
      filters: [{ name: "BotLab Files", extensions: [fileExtensionWithoutDot] }],
    });
    if (response.canceled) return;

    const projectPath = response.filePaths[0];

    try {
      const name = await window.fs.getNameFromBotFile(response.filePaths[0]);
      addProject({ name, path: projectPath });
    } catch {
      openErrorModal("Could not add project.");
    }
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
      await window.fs.getNameFromBotFile(projectPath);
    } catch {
      openErrorModal("Could not find file.");
      removeProject(projectPath);
    }
  };

  return (
    <div className="tab-content">
      <h2>Projects</h2>
      <ComponentGroup axis="horizontal" className="mb">
        <Button
          text="Create Project"
          type="success"
          icon={IconPlus}
          onClick={CreateProjectModal.show}
        />
        <Button text="Add Project" type="primary" onClick={handleAddProject} />
      </ComponentGroup>
      <hr />
      <div className="project-list mt">
        {projects.map((project, index) => (
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
      <CreateProjectModalComponent modal={CreateProjectModal} />
    </div>
  );
};

export default Home;
