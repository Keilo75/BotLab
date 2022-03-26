import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fileExtensionWithoutDot } from "src/models/file-extension";
import { ProjectInfo } from "src/models/project";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { ProjectAction } from "src/stores/ProjectReducer";
import CreateProjectModalComponent from "../../modals/CreateProjectModal";
import { Button, Divider, Group, Title, Anchor, Text, Modal } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import { useNotifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

const InfoActions = (state: IInfoStore) => state.actions;

interface Props {
  projects: ProjectInfo[];
  dispatchProjects: React.Dispatch<ProjectAction>;
  loadProjects: () => Promise<void>;
}

const Home: React.FC<Props> = ({ projects, dispatchProjects, loadProjects }) => {
  const { setTitlebar } = InfoStore(InfoActions);

  const [createProjectModalOpened, createProjectModalHandler] = useDisclosure(false);

  const navigate = useNavigate();
  const notifications = useNotifications();

  useEffect(() => {
    loadProjects();
    setTitlebar({ title: "BotLab", dirty: false }, true);
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
      notifications.showNotification({
        title: "Could not find file.",
        message: "The given path does not exist.",
        color: "red",
      });

      dispatchProjects({ type: "remove", projectPath });
    }
  };

  return (
    <div className="main-content">
      <Title order={2}>Projects</Title>
      <Group mt="xs">
        <Button leftIcon={<Plus />} onClick={createProjectModalHandler.open}>
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
      <Modal
        opened={createProjectModalOpened}
        onClose={createProjectModalHandler.close}
        centered
        title="Create Project"
      >
        <CreateProjectModalComponent
          dispatchProjects={dispatchProjects}
          close={createProjectModalHandler.close}
        />
      </Modal>
    </div>
  );
};

export default Home;
