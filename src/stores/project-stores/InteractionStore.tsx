import { Interaction, InteractionType } from "src/models/project";
import create, { EqualityChecker } from "zustand";
import { v4 as uuid } from "uuid";

export interface IInteractionStore {
  interactions: Interaction[] | undefined;
  setInteractions: (interactions: Interaction[]) => void;
  addInteraction: (type: InteractionType) => void;
}

export const InteractionStore = create<IInteractionStore>((set, get) => ({
  interactions: undefined,
  setInteractions: (interactions) => set({ interactions }),
  addInteraction: (type) => {
    const interactions = get().interactions;
    if (!interactions) return;

    set({ interactions: [...interactions, { id: uuid(), name: "Hi", parent: "0", type }] });
  },
}));
