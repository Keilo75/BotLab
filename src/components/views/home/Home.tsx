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

    const projectPath = response.filePaths[0];

    try {
      const name = await window.fs.getNameFromProjectFolder(response.filePaths[0]);
      addProject({ name, path: projectPath });
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
        {projects.map((project, index) => (
          <div key={index}>
            <Link to={""}>{project.name}</Link>
            <span> {project.path}</span>
          </div>
        ))}
      </div>
      <CreateProjectModalComponent modal={CreateProjectModal} />
    </div>
  );
};

export default Home;
