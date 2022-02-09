import { IconPlus } from "@tabler/icons";
import React, { useEffect } from "react";
import useModal from "src/hooks/useModal";
import CreateProjectModalComponent from "../modals/CreateProjectModal";
import Button from "../ui/inputs/Button";
import Tab from "../ui/tabs/Tab";
import Tabs from "../ui/tabs/Tabs";
import ComponentGroup from "../ui/utils/ComponentGroup";

const Home: React.FC = () => {
  const CreateProjectModal = useModal({ name: "create-project-modal" });

  useEffect(() => {
    CreateProjectModal.show();
  }, []);

  return (
    <div className="tab-content">
      <h2>Projects</h2>
      <ComponentGroup axis="horizontal">
        <Button
          text="Create Project"
          type="success"
          icon={IconPlus}
          onClick={CreateProjectModal.show}
        />
        <Button text="Add Project" type="primary" />
      </ComponentGroup>

      <CreateProjectModalComponent modal={CreateProjectModal} />
    </div>
  );
};

export default Home;
