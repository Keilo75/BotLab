import validateProjectName from "./validater/projectName";
import { validateLength, validateName } from "./validater/interaction";
import validateSnowflake from "./validater/snowflake";
import { Project } from "src/models/project";

export { validateProjectName, validateName as validateInteractionName, validateSnowflake };

export type ValidationErrorScopeType = "interaction" | "permission exception" | "option";
export type ValidationErrorScope = {
  id: string;
  type: ValidationErrorScopeType;
  key?: string;
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
    stacktrace: ValidationErrorScope[],
    key?: string
  ) => {
    if (message === undefined) return;
    errors.push({
      message: `${prefix}: ${message}`,
      stacktrace: stacktrace.map((scope, index) =>
        index === stacktrace.length - 1 ? { ...scope, key } : scope
      ),
    });
  };

  for (const interaction of project.interactions) {
    const stacktrace: ValidationErrorScope[] = [{ type: "interaction", id: interaction.id }];

    // Validate name
    createValidationError(
      validateName(interaction.name, interaction.type),
      "Invalid interaction name",
      stacktrace,
      "name"
    );

    // Validate description
    if (interaction.description !== undefined)
      createValidationError(
        validateLength(interaction.description, 100),
        "Invalid interaction description",
        stacktrace,
        "description"
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

    // Reference:
    // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
    if (interaction.options) {
      for (const option of interaction.options) {
        stacktrace.push({ type: "option", id: option.id });

        createValidationError(
          validateName(option.name, "message-context-menu"),
          "Invalid option name",
          stacktrace
        );

        createValidationError(
          validateLength(option.description, 100),
          "Invalid option description",
          stacktrace
        );

        stacktrace.pop();
      }
    }
  }

  return errors;
};
