import { ProjectInfo } from "src/models/project";

export type ProjectAction =
  | {
      type: "add";
      project: ProjectInfo;
    }
  | {
      type: "remove";
      projectPath: string;
    }
  | { type: "set"; projects: ProjectInfo[] };

export const projectReducer = (state: ProjectInfo[], action: ProjectAction): ProjectInfo[] => {
  switch (action.type) {
    case "add":
      return [action.project, ...state.filter((p) => p.path !== action.project.path)];

    case "remove":
      return state.filter((p) => p.path !== action.projectPath);

    case "set":
      return action.projects;
  }
};
