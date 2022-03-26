import { MenuItemProps } from "src/components/shared/title-bar/MenuItem";
import create from "zustand";

export type ContextMenuItemProps = Omit<MenuItemProps, "action" | "accelerator" | "editorOnly"> & {
  action: () => void;
};

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
  setContextMenu: (menu) => {
    if (menu === undefined) return set({ contextMenu: undefined });

    const { clientHeight, clientWidth } = document.body;

    let { x, y } = menu;
    const menuHeight = getMenuHeight(menu.items);

    if (y + menuHeight > clientHeight) y -= menuHeight;
    if (x + menu.width > clientWidth) x -= menu.width;

    set({ contextMenu: { ...menu, x, y } });
  },
}));

const getMenuHeight = (items: ContextMenuItemProps[]): number => {
  const yPadding = (2 / 3) * 10;
  const itemHeight = 26;
  const dividerHeight = 21;

  return items.reduce((acc, cur) => acc + itemHeight + (cur.divider ? dividerHeight : 0), yPadding);
};
