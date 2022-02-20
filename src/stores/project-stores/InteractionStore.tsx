import { Interaction, InteractionType } from "src/models/project";
import create, { EqualityChecker } from "zustand";
import { v4 as uuid } from "uuid";
import { getInteractionName } from "src/models/interaction-list";

export interface IInteractionStore {
  interactions: Interaction[] | undefined;
  setInteractions: (interactions: Interaction[]) => void;
  addInteraction: (type: InteractionType, parent: string) => void;
}

export const InteractionStore = create<IInteractionStore>((set, get) => ({
  interactions: undefined,
  setInteractions: (interactions) => set({ interactions }),
  addInteraction: (type, parent) => {
    const interactions = get().interactions;
    if (!interactions) return;

    const name = getInteractionName(interactions, type, parent);

    set({ interactions: [...interactions, { id: uuid(), name, parent, type }] });
  },
}));
