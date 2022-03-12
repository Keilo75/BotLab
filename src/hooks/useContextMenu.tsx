import React from "react";
import { ContextMenu, ContextMenuStore, IContextMenuStore } from "src/stores/ContextMenuStore";

const SetContextMenu = (state: IContextMenuStore) => state.setContextMenu;

export interface useContextMenuUptions {
  width?: number;
}

const useContextMenu = (
  items: ContextMenu["items"],
  options?: useContextMenuUptions
): ((e: React.MouseEvent) => void) => {
  const setContextMenu = ContextMenuStore(SetContextMenu);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items,
      width: options?.width ?? 200,
    });
  };

  return handleContextMenu;
};

export default useContextMenu;
