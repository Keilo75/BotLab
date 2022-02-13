import { IconPlus } from "@tabler/icons";
import React, { useCallback, useEffect } from "react";
import useModal from "src/hooks/useModal";
import { fileExtensionWithoutDot } from "src/models/file-extension";
import { ModalName } from "src/models/modal-name";
import { ModalStore } from "src/stores/ModalStore";
import { ProjectStore } from "src/stores/ProjectStore";
import CreateProjectModalComponent from "../../modals/CreateProjectModal";
import Button from "../../ui/inputs/Button";
import ComponentGroup from "../../ui/utils/ComponentGroup";
import ProjectListItem from "./ProjectListItem";

const Home: React.FC = () => {
  const CreateProjectModal = useModal({ name: ModalName.CREATE_NEW_PROJECT });
  const [projects, addProject] = ProjectStore(
    useCallback((state) => [state.projects, state.addProject], [])
  );
  const openErrorModal = ModalStore(useCallback((state) => state.openErrorModal, []));

  useEffect(() => {
    //CreateProjectModal.show();
  }, []);

  const handleAddProject = async () => {
    const response = await window.fs.openDialog({
      title: "Add Project",
      filters: [{ name: "BotLab Files", extensions: [fileExtensionWithoutDot] }],
    });
    if (response.canceled) return;

    try {
      const project = await window.fs.getProjectInfoFromProjectFile(response.filePaths[0]);
      addProject(project);
    } catch {
      openErrorModal("Could not add project.");
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
        {projects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </div>
      <CreateProjectModalComponent modal={CreateProjectModal} />
    </div>
  );
};

export default Home;
