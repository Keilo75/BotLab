import { Interaction } from "src/models/project";
import create from "zustand";

export interface IInteractionStore {
  interactions: Interaction[] | undefined;
  setInteractions: (interactions: Interaction[]) => void;
}

export const InteractionStore = create<IInteractionStore>((set) => ({
  interactions: undefined,
  setInteractions: (interactions) => set({ interactions }),
}));
