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
import { Button, Divider, Group, Title, Anchor, Text } from "@mantine/core";
import { Plus } from "tabler-icons-react";

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

  const handleProjectClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const projectPath = e.currentTarget.getAttribute("data-path");
    if (!projectPath) return;

    openProject(projectPath);
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
      <Title order={2}>Projects</Title>
      <Group mt="xs">
        <Button leftIcon={<Plus />} onClick={showCreateProjectModal}>
          Create Project
        </Button>

        <Button onClick={handleOpenProject} color="teal">
          Open Project
        </Button>
      </Group>
      <Divider m="xs" />
      <div className="project-list mt">
        {projects.slice(0, 10).map((project, index) => (
          <Group key={index} spacing="xs">
            <Anchor href="#" onClick={handleProjectClick} data-path={project.path}>
              {project.name}
            </Anchor>
            <Text>{project.path}</Text>
          </Group>
        ))}
      </div>
      <Modal name={ModalName.CREATE_NEW_PROJECT}>
        <CreateProjectModalComponent dispatchProjects={dispatchProjects} />
      </Modal>
    </div>
  );
};

export default Home;
