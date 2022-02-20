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

export const InteractionTypes: Record<InteractionType, string> = {
  command: "Command",
  folder: "Folder",
  user_context_menu: "User Context Menu",
  message_context_menu: "Message Context Menu",
};

export interface Interaction {
  type: InteractionType;
  id: string;
  parent: string;
  name: string;
}
