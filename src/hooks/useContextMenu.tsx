import React from "react";
import { ContextMenu, ContextMenuStore, IContextMenuStore } from "src/stores/ContextMenuStore";

const SetContextMenu = (state: IContextMenuStore) => state.setContextMenu;

const useContextMenu = (items: ContextMenu["items"]): ((e: React.MouseEvent) => void) => {
  const setContextMenu = ContextMenuStore(SetContextMenu);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items,
    });
  };

  return handleContextMenu;
};

export default useContextMenu;
