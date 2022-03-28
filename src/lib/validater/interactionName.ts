import { InteractionType, isTextBased } from "src/models/interactions";

const validateInteractionName = (name: string, type: InteractionType): string | undefined => {
  // Reference:
  // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming

  if (name.length === 0) return "Required";
  if (name.length > 32) return "Maximum length is 32 characters";
  if (isTextBased(type) && !/^[\w-]{1,32}$/.test(name)) return "Cannot contain special characters";
};

export default validateInteractionName;