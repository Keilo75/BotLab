import React, { useState } from "react";
import AppLogo from "assets/icon/icon.svg";
import MenuPane, { MenuPaneProps } from "./MenuPane";

const TitleBar: React.FC = ({}) => {
  const [selectedPane, setSelectedPane] = useState<string | undefined>("File");

  const menu: MenuPaneProps[] = [
    { name: "File", children: [{ name: "Save", accelerator: "Ctrl + S", disabledAtHome: true }] },
    { name: "View", children: [{ name: "Toggle Dev Tools" }] },
  ];

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
            />
          ))}
        </div>
      </div>
      {selectedPane && <div className="overlay" onClick={handleOverlayClick} />}
    </>
  );
};

export default TitleBar;
