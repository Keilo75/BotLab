import validateProjectName from "./validater/projectName";
import { validateInteractionDescription, validateInteractionName } from "./validater/interaction";
import validateSnowflake from "./validater/snowflake";
import { Project } from "src/models/project";

export { validateProjectName, validateInteractionName, validateSnowflake };

export type ValidationErrorScopeType = "interaction" | "permission exception";
export type ValidationErrorScope = {
  id: string;
  type: ValidationErrorScopeType;
};

interface ValidationError {
  message: string;
  stacktrace: ValidationErrorScope[];
}

export const validateProject = (project: Project): ValidationError[] => {
  const errors: ValidationError[] = [];

  const createValidationError = (
    message: string | undefined,
    prefix: string,
    stacktrace: ValidationErrorScope[]
  ) => {
    if (message === undefined) return;
    errors.push({ message: `${prefix}: ${message}`, stacktrace: [...stacktrace] });
  };

  for (const interaction of project.interactions) {
    const stacktrace: ValidationErrorScope[] = [{ type: "interaction", id: interaction.id }];

    // Validate name
    createValidationError(
      validateInteractionName(interaction.name, interaction.type),
      "Invalid name",
      stacktrace
    );

    // Validate description
    if (interaction.description !== undefined)
      createValidationError(
        validateInteractionDescription(interaction.description),
        "Invalid description",
        stacktrace
      );

    // Validate permissions
    if (interaction.permissions) {
      for (const exception of interaction.permissions.exceptions) {
        stacktrace.push({ type: "permission exception", id: exception.id });

        createValidationError(
          validateSnowflake(exception.identifier),
          "Invalid snowflake",
          stacktrace
        );
        stacktrace.pop();
      }
    }
  }

  return errors;
};
