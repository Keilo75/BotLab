import { Interaction, InteractionType } from "src/models/project";
import create, { EqualityChecker } from "zustand";
import { v4 as uuid } from "uuid";
import { getAllChildInteractions, getInteractionName } from "src/models/interactions";

export interface IInteractionStore {
  interactions: Interaction[] | undefined;
  setInteractions: (interactions: Interaction[]) => void;
  addInteraction: (type: InteractionType) => void;
  deleteInteraction: (id: string) => void;
  selectedInteractionID: string | undefined;
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

    set({
      interactions: [...interactions, newInteraction],
      selectedInteractionID: newInteraction.id,
    });
  },
  deleteInteraction: (id) => {
    const interactions = get().interactions;
    if (!interactions) return;

    const deletedIDs = [id, ...getAllChildInteractions(interactions, id).map((i) => i.id)];
    const newInteractions = interactions.filter((i) => !deletedIDs.includes(i.id));

    const selectedID = get().selectedInteractionID;
    if (selectedID && deletedIDs.includes(selectedID)) {
      set({ interactions: newInteractions, selectedInteractionID: undefined });
    } else {
      set({ interactions: newInteractions });
    }
  },
  selectedInteractionID: undefined,
  selectInteraction: (id) => {
    set({ selectedInteractionID: id });
  },
}));
