import React, { useCallback } from "react";
import { ContextMenu, ContextMenuStore } from "src/stores/ContextMenuStore";

const useContextMenu = (items: ContextMenu["items"]): ((e: React.MouseEvent) => void) => {
  const setContextMenu = ContextMenuStore(useCallback((state) => state.setContextMenu, []));

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
