import { ProjectInfo } from "src/models/project";
import create from "zustand";

export interface IProjectStore {
  projects: ProjectInfo[];
  addProject: (dir: ProjectInfo) => void;
  removeProject: (dir: ProjectInfo) => void;
  setProjects: (projects: ProjectInfo[]) => void;
}

export const ProjectStore = create<IProjectStore>((set, get) => ({
  projects: [],
  addProject: (dir) => {
    const projects = get().projects;
    if (projects.some((p) => p.path === dir.path)) return;

    set({ projects: [...get().projects, dir] });
  },
  removeProject: (dir) => {
    const projects = get().projects;
    set({ projects: projects.filter((project) => project.path !== dir.path) });
  },
  setProjects: (projects) => {
    set({ projects });
  },
}));
