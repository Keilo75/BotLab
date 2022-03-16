import { useClickOutside } from "@mantine/hooks";
import React from "react";
import { createPortal } from "react-dom";
import { ContextMenuStore, IContextMenuStore } from "src/stores/ContextMenuStore";
import MenuItem from "./title-bar/MenuItem";
import MenuList from "./title-bar/MenuList";

const ContextMenuSelector = (state: IContextMenuStore) => state.contextMenu;
const SetContextMenu = (state: IContextMenuStore) => state.setContextMenu;

const ContextMenu: React.FC = () => {
  const contextMenuRoot = document.getElementById("context-menu-root");
  if (!contextMenuRoot) return null;

  const contextMenu = ContextMenuStore(ContextMenuSelector);
  const setContextMenu = ContextMenuStore(SetContextMenu);

  const ref = useClickOutside(() => setContextMenu(undefined));

  const handleMenuItemClick = (name: string) => {
    if (!contextMenu) return;

    const item = contextMenu.items.find((item) => item.name === name);
    if (item) {
      item.action();
      setContextMenu(undefined);
    }
  };

  const menu = contextMenu && (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: contextMenu.y,
        left: contextMenu.x,
        width: contextMenu.width,
      }}
      className="context-menu"
    >
      <MenuList>
        {contextMenu.items.map((item) => (
          <MenuItem
            key={item.name}
            scope="context-menu"
            item={item}
            handleMenuItemClick={handleMenuItemClick}
          />
        ))}
      </MenuList>
    </div>
  );

  return createPortal(menu, contextMenuRoot);
};

export default ContextMenu;
