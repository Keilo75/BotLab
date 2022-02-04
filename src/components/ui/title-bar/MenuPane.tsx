import React from "react";
import { MenuAction } from "src/@types/index.d";
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
  const isSelected = pane.name == selectedPane;

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
      <button className="menu-button" onClick={handleMenuPaneClick} tabIndex={-1}>
        {pane.name}
      </button>
      {isSelected && (
        <ul className="menu-list">
          {pane.children.map((item) => (
            <MenuItem key={item.name} item={item} handleMenuItemClick={handleMenuItemClick} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuPane;
