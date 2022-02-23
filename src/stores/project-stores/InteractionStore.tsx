import { Interaction, InteractionType } from "src/models/project";
import create, { EqualityChecker } from "zustand";
import { v4 as uuid } from "uuid";
import { getAllChildInteractions, getInteractionName } from "src/models/interaction-list";

export interface IInteractionStore {
  interactions: Interaction[] | undefined;
  setInteractions: (interactions: Interaction[]) => void;
  addInteraction: (type: InteractionType) => void;
  deleteInteraction: (id: string) => void;
  selectedInteraction: Interaction | undefined;
  selectInteraction: (interactionID: string) => void;
}

export const InteractionStore = create<IInteractionStore>((set, get) => ({
  interactions: undefined,
  setInteractions: (interactions) => set({ interactions }),
  addInteraction: (type) => {
    const interactions = get().interactions;
    if (!interactions) return;

    const name = getInteractionName(interactions, type);
    const newInteraction = { id: uuid(), name, parent: "0", type };

    set({ interactions: [...interactions, newInteraction], selectedInteraction: newInteraction });
  },
  deleteInteraction: (id) => {
    const interactions = get().interactions;
    if (!interactions) return;

    const childrenIDs = getAllChildInteractions(interactions, id).map((i) => i.id);
    const newInteractions = interactions.filter((i) => {
      if (i.id === id) return false;
      if (childrenIDs.includes(i.id)) return false;

      return true;
    });

    set({ interactions: newInteractions });
  },
  selectedInteraction: undefined,
  selectInteraction: (id) => {
    const interactions = get().interactions;
    const interaction = interactions?.find((i) => i.id === id);

    if (!interaction) return;
    set({ selectedInteraction: interaction });
  },
}));
