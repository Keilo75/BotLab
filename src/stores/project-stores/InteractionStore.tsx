import { Interaction, InteractionType, isTextBased } from "src/models/interactions";
import create from "zustand";
import { v4 as uuid } from "uuid";
import { getAllChildInteractions, getInteractionName } from "src/models/interactions";

export interface IInteractionStore {
  interactions: Interaction[] | undefined;
  selectedInteractionID: string | undefined;
  actions: {
    setInteractions: (interactions: Interaction[]) => void;
    addInteraction: (type: InteractionType) => void;
    deleteInteraction: (id: string) => void;
    renameInteraction: (interactionID: string, newName: string) => void;
    selectInteraction: (interactionID: string) => void;
  };
}

export const InteractionStore = create<IInteractionStore>((set, get) => ({
  interactions: undefined,
  selectedInteractionID: undefined,
  actions: {
    setInteractions: (interactions) => set({ interactions }),
    addInteraction: (type) => {
      const interactions = get().interactions;
      if (!interactions) return;

      const textBased = isTextBased(type);
      const name = getInteractionName(interactions, type, textBased);
      const newInteraction: Interaction = {
        id: uuid(),
        name,
        parent: "0",
        type,
      };

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
    renameInteraction: (id, newName) => {
      const interactions = get().interactions;
      if (!interactions) return;

      const newInteractions = interactions.map((i) => (i.id === id ? { ...i, name: newName } : i));
      set({ interactions: newInteractions });
    },
    selectInteraction: (id) => {
      set({ selectedInteractionID: id });
    },
  },
}));
