import { MenuItemProps } from "src/components/shared/title-bar/MenuItem";
import create from "zustand";

export type ContextMenuItemProps = Omit<
  MenuItemProps,
  "action" | "accelerator" | "disabled" | "editorOnly"
> & { action: () => void };

export interface ContextMenu {
  items: ContextMenuItemProps[];
  x: number;
  y: number;
  width: number;
}

export interface IContextMenuStore {
  contextMenu: ContextMenu | undefined;
  setContextMenu: (menu: ContextMenu | undefined) => void;
}

export const ContextMenuStore = create<IContextMenuStore>((set) => ({
  contextMenu: undefined,
  setContextMenu: (menu) => set({ contextMenu: menu }),
}));
