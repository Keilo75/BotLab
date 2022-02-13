import { ProjectInfo } from "src/models/project";
import create from "zustand";

export interface IProjectStore {
  projects: ProjectInfo[];
  addProject: (project: ProjectInfo) => void;
  removeProject: (id: string) => void;
  setProjects: (projects: ProjectInfo[]) => void;
}

export const ProjectStore = create<IProjectStore>((set, get) => ({
  projects: [],
  addProject: (project) => {
    const projects = get().projects;
    if (projects.some((p) => p.name === project.name || p.folder === project.folder)) return;

    set({ projects: [...get().projects, project] });
  },
  removeProject: (id) => {
    const projects = get().projects;
    set({ projects: projects.filter((project) => project.id !== id) });
  },
  setProjects: (projects) => {
    set({ projects });
  },
}));
