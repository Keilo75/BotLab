import { Paper, Text } from "@mantine/core";
import React from "react";
import { MenuAction } from "src/models/menu-action";
import MenuItem, { MenuItemProps } from "./MenuItem";

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
        <Paper
          className="menu-list"
          sx={(theme) => ({
            background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
            borderRadius: 0,
          })}
        >
          {pane.children.map((item) => (
            <MenuItem key={item.name} item={item} handleMenuItemClick={handleMenuItemClick} />
          ))}
        </Paper>
      )}
    </div>
  );
};

export default MenuPane;
