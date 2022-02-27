import { Interaction, InteractionType, InteractionTypes } from "./project";
export const getAllChildInteractions = (
  interactions: Interaction[],
  interactionID: string
): Interaction[] => {
  const childInteractions: Interaction[] = [];
  const firstLevelChilds = interactions.filter((i) => i.parent === interactionID);

  for (const interaction of firstLevelChilds) {
    childInteractions.push(interaction);

    if (interaction.type === "folder")
      childInteractions.push(...getAllChildInteractions(interactions, interaction.id));
  }

  return childInteractions;
};

export const getAllInteractionsWithSameParent = (
  interactions: Interaction[],
  parent: string
): Interaction[] => {
  const sameParentInteractions = interactions.filter((i) => i.parent === parent);

  return sameParentInteractions;
};

export const getInteractionName = (
  interactions: Interaction[],
  type: InteractionType,
  textBased: boolean
): string => {
  const humanName = textBased ? `new-${type}` : `New ${InteractionTypes[type]}`;

  const filteredInteractions = interactions
    .filter((cmd) => cmd.name.startsWith(humanName))
    .map((cmd) => {
      const numbers = cmd.name.match(/\d+/);
      if (numbers) return numbers[0];

      return "0";
    });

  if (filteredInteractions.length === 0) return humanName;

  let lowestNumber = 1;
  while (filteredInteractions.includes(lowestNumber.toString())) {
    lowestNumber++;
  }

  return `${humanName}${textBased ? "-" : " "}${lowestNumber}`;
};

export const validateInteractionName = (name: string): string | undefined => {
  // Reference: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming

  if (name.length === 0) return "Required";
  if (name.length > 32) return "Maximum length is 32 characters";
  return;
};