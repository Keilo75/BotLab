import { NodeModel } from "@minoru/react-dnd-treeview";
import { Interaction, InteractionType } from "./interactions";

export type NodeModelInteractionData = { type: InteractionType };
export type InteractionNode = NodeModel<NodeModelInteractionData>;

export const convertInteractionsToNodeModelArray = (
  interactions: Interaction[]
): InteractionNode[] => {
  return interactions.map((i) => ({
    id: i.id,
    parent: i.parent,
    text: i.name,
    droppable: i.type === "folder",
    data: { type: i.type },
  }));
};

export const getParentsFromNodeModel = (nodeModels: InteractionNode[]): Record<string, string> => {
  const directory: Record<string, string> = {};

  for (const m of nodeModels) {
    directory[m.id.toString()] = m.parent.toString();
  }

  return directory;
};

export const getParents = (tree: Interaction[], id: string): Array<string> => {
  const target = tree.find((node) => node.id === id);
  if (!target || target.parent === "0") return [];

  const parent = tree.find((cmd) => cmd.id === target.parent) as Interaction;

  return [parent.id.toString(), ...getParents(tree, parent.id.toString())];
};

export const getDepth = (tree: InteractionNode[], id: string | number, depth = 0): number => {
  const target = tree.find((node) => node.id === id);

  if (target) return getDepth(tree, target.parent, depth + 1);

  return depth;
};
