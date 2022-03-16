import { Text } from "@mantine/core";
import React from "react";

import { MenuAction } from "src/models/menu-action";
import MenuItem, { MenuItemProps } from "./MenuItem";
import MenuList from "./MenuList";

export interface MenuPaneProps {
  name: string;
  children: MenuItemProps[];
}

interface Props {
  pane: MenuPaneProps;
  selectedPane: string | undefined;
  setSelectedPane: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleItemClick(action: MenuAction): void;
}

const MenuPane: React.FC<Props> = ({ pane, selectedPane, setSelectedPane, handleItemClick }) => {
  const isSelected = pane.name === selectedPane;

  const handleMenuPaneClick = () => {
    if (selectedPane !== undefined) return setSelectedPane(undefined);
    setSelectedPane(pane.name);
  };

  const handleMenuPaneHover = () => {
    if (selectedPane !== undefined) setSelectedPane(pane.name);
  };

  const handleMenuItemClick = (action: MenuAction) => {
    setSelectedPane(undefined);
    handleItemClick(action);
  };

  return (
    <div className="menu-pane" onMouseEnter={handleMenuPaneHover}>
      <div
        className="menu-button"
        onClick={handleMenuPaneClick}
        tabIndex={-1}
        data-menu-pane={pane.name}
      >
        <Text>{pane.name}</Text>
      </div>
      {isSelected && (
        <MenuList>
          {pane.children.map((item) => (
            <MenuItem
              scope="title-bar"
              key={item.name}
              item={item}
              handleMenuItemClick={handleMenuItemClick}
            />
          ))}
        </MenuList>
      )}
    </div>
  );
};

export default MenuPane;
