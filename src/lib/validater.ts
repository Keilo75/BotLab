import validateProjectName from "./validater/projectName";
import { validateInteractionDescription, validateInteractionName } from "./validater/interaction";
import validateSnowflake from "./validater/snowflake";
import { Project } from "src/models/project";

export { validateProjectName, validateInteractionName, validateSnowflake };

export type ValidationErrorScopeType = "interaction";
export type ValidationErrorScope = {
  id: string;
  type: "interaction";
  name: string;
};

interface ValidationError {
  message: string;
  stacktrace: ValidationErrorScope[];
}

export const validateProject = (project: Project): ValidationError[] => {
  const errors: ValidationError[] = [];

  let stacktrace: ValidationErrorScope[] = [];
  const createValidationError = (message: string | undefined, prefix: string) => {
    if (message === undefined) return;
    errors.push({ message: `${prefix}: ${message}`, stacktrace });
  };

  for (const interaction of project.interactions) {
    stacktrace = [{ type: "interaction", id: interaction.id, name: interaction.name }];

    createValidationError(
      validateInteractionName(interaction.name, interaction.type),
      "Invalid name"
    );

    if (interaction.description !== undefined)
      createValidationError(
        validateInteractionDescription(interaction.description),
        "Invalid description"
      );
  }

  return errors;
};
