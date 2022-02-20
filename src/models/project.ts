export interface ProjectInfo {
  name: string;
  path: string;
}

export interface Project {
  settings: ProjectSettings;
  interactions: Interaction[];
}

export interface ProjectSettings {
  name: string;
  token: string;
}

export type InteractionType = "command" | "folder" | "user_context_menu" | "message_context_menu";

export interface Interaction {
  type: InteractionType;
  id: string;
  parent: string;
  name: string;
}
