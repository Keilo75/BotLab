import clsx from "clsx";
import React from "react";
import ReactDOM from "react-dom";
import useOutsideClick from "src/hooks/useOutsideClick";
import { ContextMenuStore } from "src/stores/ContextMenuStore";
import MenuItem from "./title-bar/MenuItem";

const ContextMenu: React.FC = () => {
  const contextMenuRoot = document.getElementById("context-menu-root");
  if (!contextMenuRoot) return null;

  const [contextMenu, setContextMenu] = ContextMenuStore((state) => [
    state.contextMenu,
    state.setContextMenu,
  ]);

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
      <ul className="context-menu menu-list" style={{ top: contextMenu.y, left: contextMenu.x }}>
        {contextMenu.items.map((item) => (
          <React.Fragment key={item.name}>
            <li className={clsx("menu-item")} onClick={handleMenuItemClick} data-name={item.name}>
              <span>{item.name}</span>
            </li>
            {item.divider && <hr />}
          </React.Fragment>
        ))}
      </ul>
    </>
  );

  return ReactDOM.createPortal(menu, contextMenuRoot);
};

export default ContextMenu;
