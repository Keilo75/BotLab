import { NodeModel } from "@minoru/react-dnd-treeview";
import { Interaction, InteractionType, InteractionTypes } from "./project";

export type NodeModelInteractionData = Pick<Interaction, "type">;
export type InteractionNode = NodeModel<NodeModelInteractionData>;

export const convertInteractionsToNodeModelArray = (
  interactions: Interaction[]
): InteractionNode[] => {
  return interactions.map((i) => ({
    id: i.id,
    parent: i.parent,
    text: i.name,
    droppable: i.type === "folder",
    data: {
      type: i.type,
    },
  }));
};

export const convertNodeModelToInteractionsArray = (
  nodeModels: InteractionNode[]
): Interaction[] => {
  const interactions: Interaction[] = [];

  for (const m of nodeModels) {
    if (m.data)
      interactions.push({
        id: m.id.toString(),
        parent: m.parent.toString(),
        name: m.text,
        ...m.data,
      });
  }

  return interactions;
};

export const getDepth = (tree: InteractionNode[], id: string | number, depth = 0): number => {
  const target = tree.find((node) => node.id === id);

  if (target) return getDepth(tree, target.parent, depth + 1);

  return depth;
};
