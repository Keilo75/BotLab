export interface ProjectInfo {
  name: string;
  path: string;
}

export interface Project {
  settings: ProjectSettings;
  commands: ProjectCommand[];
}

export interface ProjectSettings {
  name: string;
  token: string;
}

export interface ProjectCommand {}
