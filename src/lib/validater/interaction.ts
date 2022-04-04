import { InteractionType, isTextBased } from "src/models/interactions";

export const validateInteractionName = (
  name: string,
  type: InteractionType
): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming

  if (name.length === 0) return "Cannot be empty";
  if (name.length > 32) return "Maximum length is 32 characters";
  if (isTextBased(type) && !/^[\w-]{1,32}$/.test(name)) return "Cannot contain special characters";
};

export const validateInteractionDescription = (description: string): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure

  if (description.length === 0) return "Cannot be empty";
  if (description.length > 100) return "Maximum length is 100 characters";
};

export const validateInteractionOptionName = (description: string): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure

  if (description.length === 0) return "Cannot be empty";
  if (description.length > 32) return "Maximum length is 100 characters";
};
