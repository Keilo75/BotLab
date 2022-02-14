import { ProjectInfo } from "src/models/project";
import create from "zustand";

export interface IProjectStore {
  projects: ProjectInfo[];
  addProject: (project: ProjectInfo) => void;
  removeProject: (dir: string) => void;
  setProjects: (projects: ProjectInfo[]) => void;
}

export const ProjectStore = create<IProjectStore>((set, get) => ({
  projects: [],
  addProject: (project) => {
    let oldProjects = get().projects;

    if (oldProjects.some((p) => p.path === project.path)) {
      oldProjects = oldProjects.filter((p) => p.path !== project.path);
    }

    set({ projects: [project, ...oldProjects] });
  },
  removeProject: (dir) => {
    const projects = get().projects;
    set({ projects: projects.filter((project) => project.path !== dir) });
  },
  setProjects: (projects) => {
    set({ projects });
  },
}));
