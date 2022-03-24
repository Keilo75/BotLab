export type InteractionType = "command" | "folder" | "user-context-menu" | "message-context-menu";
export const InteractionTypes: Record<InteractionType, string> = {
  command: "Command",
  folder: "Folder",
  "user-context-menu": "User Context Menu",
  "message-context-menu": "Message Context Menu",
};

export interface Interaction {
  id: string;
  parent: string;
  name: string;
  type: InteractionType;
  description?: string;
  permissions?: InteractionPermission;
}

export interface InteractionPermission {
  disabledByDefault: boolean;
  exceptions: InteractionPermissionException[];
}

export type InteractionPermissionExceptionType = "role" | "user";
export type InteractionPermissionException = {
  id: string;
  type: InteractionPermissionExceptionType;
  identifier: string;
};

export const isTextBased = (type: InteractionType): type is "command" | "folder" => {
  return type === "folder" || type === "command";
};

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
