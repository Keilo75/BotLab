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

export const getProjectNameError = (name: string): string | undefined => {
  if (name.length === 0) return "Required";
  if (!name.match(/^[a-zA-Z\s]*$/)) return "May only include letters and spaces";

  return;
};

export type InteractionType = "command" | "folder" | "user-context-menu" | "message-context-menu";

export const InteractionTypes: Record<InteractionType, string> = {
  command: "Command",
  folder: "Folder",
  "user-context-menu": "User Context Menu",
  "message-context-menu": "Message Context Menu",
};

export interface Interaction {
  type: InteractionType;
  id: string;
  parent: string;
  name: string;
}
