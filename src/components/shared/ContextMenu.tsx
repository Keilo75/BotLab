import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import useOutsideClick from "src/hooks/useOutsideClick";
import { ContextMenuStore, IContextMenuStore } from "src/stores/ContextMenuStore";

const ContextMenuSelector = (state: IContextMenuStore) => state.contextMenu;
const SetContextMenu = (state: IContextMenuStore) => state.setContextMenu;

const ContextMenu: React.FC = () => {
  const contextMenuRoot = document.getElementById("context-menu-root");
  if (!contextMenuRoot) return null;

  const contextMenu = ContextMenuStore(ContextMenuSelector);
  const setContextMenu = ContextMenuStore(SetContextMenu);

  useOutsideClick(".context-menu", () => setContextMenu(undefined));

  const handleMenuItemClick = (e: React.MouseEvent) => {
    if (!contextMenu) return;

    const name = e.currentTarget.getAttribute("data-name");
    if (!name) return;

    const item = contextMenu.items.find((item) => item.name === name);
    if (item) {
      item.action();
      setContextMenu(undefined);
    }
  };

  const menu = contextMenu && (
    <>
      <ul
        className="context-menu"
        style={{ top: contextMenu.y, left: contextMenu.x, width: contextMenu.width }}
      >
        {contextMenu.items.map((item) => (
          <React.Fragment key={item.name}>
            <li className={clsx("menu-item")} onClick={handleMenuItemClick} data-name={item.name}>
              {item.name}
            </li>
            {item.divider && <hr />}
          </React.Fragment>
        ))}
      </ul>
    </>
  );

  return createPortal(menu, contextMenuRoot);
};

export default ContextMenu;
