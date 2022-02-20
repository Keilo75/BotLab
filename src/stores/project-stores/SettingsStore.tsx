import { ProjectSettings } from "src/models/project";
import create from "zustand";

export type InfoBarType = "success" | "loading" | "error";

export interface ISettingsStore {
  settings: ProjectSettings | undefined;
  setSettings: (settings: ProjectSettings) => void;
}

export const SettingsStore = create<ISettingsStore>((set) => ({
  settings: undefined,
  setSettings: (settings) => set({ settings }),
}));
