import React, { useState } from "react";
import AppLogo from "assets/icon/icon.svg";
import Minimize from "assets/images/minimize.svg";
import Maximize from "assets/images/maximize.svg";
import Close from "assets/images/close.svg";
import MenuPane, { MenuPaneProps } from "./MenuPane";
import { MenuAction } from "src/models/menu-action";

interface Props {
  handleMenuItemClick(action: MenuAction): void;
}

const TitleBar: React.FC<Props> = ({ handleMenuItemClick }) => {
  const [selectedPane, setSelectedPane] = useState<string>();

  const menu: MenuPaneProps[] = [
    {
      name: "File",
      children: [
        {
          name: "Save",
          action: MenuAction.SAVE,
          accelerator: "Ctrl+S",
          editorOnly: true,
          divider: true,
        },
        { name: "Options", action: MenuAction.OPTIONS, accelerator: "Ctrl+,", divider: true },
        { name: "Exit", action: MenuAction.EXIT, accelerator: "Alt+F4" },
      ],
    },
    {
      name: "View",
      children: [
        {
          name: "Toggle Dev Tools",
          action: MenuAction.TOGGLE_DEV_TOOLS,
          accelerator: "Ctrl+Shift+I",
        },
      ],
    },
  ];

  const handleWindowControlClick = (e: React.MouseEvent) => {
    const actions = {
      minimize: MenuAction.MINIMIZE,
      maximize: MenuAction.MAXIMIZE,
      close: MenuAction.EXIT,
    };

    const actionType = e.currentTarget.getAttribute("data-btn-action") as keyof typeof actions;
    if (actionType) window.ipc.handleTitleBarAction(actions[actionType]);
  };

  const handleOverlayClick = () => {
    setSelectedPane(undefined);
  };

  return (
    <>
      <div className="title-bar">
        <div className="app-logo">
          <img src={AppLogo} className="app-logo" />
        </div>
        <div className="menus">
          {menu.map((pane) => (
            <MenuPane
              key={pane.name}
              pane={pane}
              selectedPane={selectedPane}
              setSelectedPane={setSelectedPane}
              handleItemClick={handleMenuItemClick}
            />
          ))}
        </div>
        <div className="window-control">
          <button
            className="window-control-btn"
            tabIndex={-1}
            onClick={handleWindowControlClick}
            data-btn-action="minimize"
          >
            <img src={Minimize} />
          </button>
          <button
            className="window-control-btn"
            tabIndex={-1}
            onClick={handleWindowControlClick}
            data-btn-action="maximize"
          >
            <img src={Maximize} />
          </button>
          <button
            className="window-control-btn"
            tabIndex={-1}
            onClick={handleWindowControlClick}
            data-btn-action="close"
          >
            <img src={Close} />
          </button>
        </div>
      </div>
      {selectedPane && <div className="overlay" onClick={handleOverlayClick} />}
    </>
  );
};

export default TitleBar;
