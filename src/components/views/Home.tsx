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
    <>
      <Tabs name="Home" axis="horizontal">
        <Tab name="Projects">
          <ComponentGroup axis="horizontal">
            <Button
              text="Create Project"
              type="success"
              icon={IconPlus}
              onClick={CreateProjectModal.show}
            />
            <Button text="Add Project" type="primary" />
          </ComponentGroup>
        </Tab>
        <Tab name="Learn"></Tab>
        <Tab name="About"></Tab>
      </Tabs>
      <CreateProjectModalComponent modal={CreateProjectModal} />
    </>
  );
};

export default Home;
