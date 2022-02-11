import { Project } from "src/models/project";
import create from "zustand";

export interface IProjectStore {
  projects: Project[];
  addProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
}

export const ProjectStore = create<IProjectStore>((set, get) => ({
  projects: [],
  addProject: (project) => {
    const projects = get().projects;
    if (projects.some((p) => p.name === project.name)) return;

    set({ projects: [...get().projects, project] });
  },
  setProjects: (projects) => {
    set({ projects });
  },
}));
