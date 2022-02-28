import {
  Interaction,
  InteractionType,
  isTextBased,
  getAllChildInteractions,
  getInteractionName,
} from "src/models/interactions";
import create from "zustand";
import { v4 as uuid } from "uuid";

export interface IInteractionStore {
  interactions: Interaction[] | undefined;
  selectedInteractionID: string | undefined;
  actions: {
    setInteractions: (interactions: Interaction[]) => void;
    updateParents: (parents: Record<string, string>) => void;
    addInteraction: (type: InteractionType) => void;
    deleteInteraction: (id: string) => void;
    renameInteraction: (interactionID: string, newName: string) => void;
    selectInteraction: (interactionID: string) => void;
    updateSelectedInteraction: <T extends keyof Interaction>(key: T, value: Interaction[T]) => void;
  };
}

export const InteractionStore = create<IInteractionStore>((set, get) => ({
  interactions: undefined,
  selectedInteractionID: undefined,
  actions: {
    setInteractions: (interactions) => set({ interactions }),
    updateParents: (parents) => {
      const interactions = get().interactions;
      if (!interactions) return;

      const newInteractions = interactions.map((i) => ({ ...i, parent: parents[i.id] }));
      set({ interactions: newInteractions });
    },
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

      if (textBased) newInteraction.description = "";

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
    updateSelectedInteraction: (key, value) => {
      const interactions = get().interactions;
      const selectedInteractionID = get().selectedInteractionID;
      if (!interactions || !selectedInteractionID) return;

      const newInteractions = interactions.map((i) =>
        i.id === selectedInteractionID ? { ...i, [key]: value } : i
      );
      set({ interactions: newInteractions });
    },
  },
}));
