import { Interaction } from "./interactions";

export interface ProjectInfo {
  name: string;
  path: string;
}

export interface ProjectSettings {
  name: string;
  token: string;
}

export interface Project {
  settings: ProjectSettings;
  interactions: Interaction[];
}
