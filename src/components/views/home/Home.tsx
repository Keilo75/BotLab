import { IconPlus } from "@tabler/icons";
import React, { useCallback, useEffect } from "react";
import useModal from "src/hooks/useModal";
import { ModalName } from "src/models/modal-name";
import { ProjectStore } from "src/stores/ProjectStore";
import CreateProjectModalComponent from "../../modals/CreateProjectModal";
import Button from "../../ui/inputs/Button";
import ComponentGroup from "../../ui/utils/ComponentGroup";
import ProjectListItem from "./ProjectListItem";

const Home: React.FC = () => {
  const CreateProjectModal = useModal({ name: ModalName.CREATE_NEW_PROJECT });
  const [projects] = ProjectStore(useCallback((state) => [state.projects], []));

  useEffect(() => {
    //CreateProjectModal.show();
  }, []);

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
        <Button text="Add Project" type="primary" />
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
