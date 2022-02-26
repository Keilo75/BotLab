import { Interaction, InteractionType } from "./project";
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

export const getInteractionName = (interactions: Interaction[], type: InteractionType): string => {
  const humanName = `new-${type}`;

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

  return `${humanName}-${lowestNumber}`;
};

export const validateInteractionName = (
  name: string,
  type: InteractionType
): string | undefined => {
  console.log(/^[\w-]{1,32}/g.test(name));

  if (name.length === 0) return "Required";
  if (name.length > 32) return "May only be 32 characters long";
  if (!name.match(/^[\w-]/g)) return "Cannot include special characters";

  return;
};
