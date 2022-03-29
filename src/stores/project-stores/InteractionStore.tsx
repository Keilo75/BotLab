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
    updateParents: (parents: Record<string, string>, order: string[]) => void;
    addInteraction: (type: InteractionType) => void;
    deleteInteraction: (interactionID: string) => void;
    cloneInteraction: (interactionID: string) => void;
    selectInteraction: (interactionID: string) => void;
    updateSelectedInteraction: <T extends keyof Interaction>(key: T, value: Interaction[T]) => void;
  };
}

export const InteractionStore = create<IInteractionStore>((set, get) => ({
  interactions: undefined,
  selectedInteractionID: undefined,
  actions: {
    setInteractions: (interactions) => set({ interactions }),
    updateParents: (parents, order) => {
      const interactions = get().interactions;
      if (!interactions) return;

      const newInteractions: Interaction[] = order.map((id) => ({
        ...interactions.find((i) => i.id === id)!,
        parent: parents[id],
      }));
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
        permissions: { disabledByDefault: false, exceptions: [] },
      };

      if (textBased) {
        newInteraction.description = "";

        if (type === "command") newInteraction.options = [];
      }

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
    selectInteraction: (id) => {
      set({ selectedInteractionID: id });
    },
    cloneInteraction: (id) => {
      const interactions = get().interactions;
      if (!interactions) return;

      const index = interactions.findIndex((i) => i.id === id);
      const interaction = interactions[index];

      const clone: Interaction = structuredClone(interaction);
      clone.id = uuid();

      set({
        interactions: [
          ...interactions.slice(0, index + 1),
          clone,
          ...interactions.slice(index + 1),
        ],
        selectedInteractionID: clone.id,
      });
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
