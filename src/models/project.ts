export interface ProjectInfo {
  name: string;
  path: string;
}

export interface Project {
  settings: ProjectSettings;
  interactions: ProjectInteraction[];
}

export interface ProjectSettings {
  name: string;
  token: string;
}

export interface ProjectInteraction {}
