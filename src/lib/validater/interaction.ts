import { InteractionType, isTextBased } from "src/models/interactions";

export const validateName = (name: string, type: InteractionType): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming

  if (name.length === 0) return "Cannot be empty";
  if (name.length > 32) return "Maximum length is 32 characters";
  if (isTextBased(type) && !/^[\w-]{1,32}$/.test(name)) return "Cannot contain special characters";
};

export const validateLength = (text: string, max: number): string | undefined => {
  if (text.length === 0) return "Cannot be empty";
  if (text.length > max) return `Maximum length is ${max} characters`;
};
