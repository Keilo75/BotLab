import React from "react";
import MenuItem, { MenuItemProps } from "./MenuItem";

export interface MenuPaneProps {
  name: string;
  children: MenuItemProps[];
}

interface Props {
  pane: MenuPaneProps;
  selectedPane: string | undefined;
  setSelectedPane: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const MenuPane: React.FC<Props> = ({ pane, selectedPane, setSelectedPane }) => {
  const isSelected = pane.name == selectedPane;

  const handleMenuClick = () => {
    if (selectedPane !== undefined) return setSelectedPane(undefined);
    setSelectedPane(pane.name);
  };

  const handleMenuHover = () => {
    if (selectedPane !== undefined) setSelectedPane(pane.name);
  };

  return (
    <div className="menu-pane" onMouseEnter={handleMenuHover}>
      <button className="menu-button" onClick={handleMenuClick}>
        {pane.name}
      </button>
      {isSelected && (
        <ul className="menu-list">
          {pane.children.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuPane;
