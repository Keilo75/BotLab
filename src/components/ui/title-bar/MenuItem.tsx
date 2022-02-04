import clsx from "clsx";
import React from "react";
import { MenuAction } from "src/@types/index.d";

export interface MenuItemProps {
  name: string;
  action: MenuAction;
  accelerator?: string;
  disabled?: boolean;
  editorOnly?: boolean;
  divider?: boolean;
}

interface Props {
  item: MenuItemProps;
  handleMenuItemClick(action: MenuAction): void;
}

const MenuItem: React.FC<Props> = ({ item, handleMenuItemClick }) => {
  const disabled = item.disabled || item.editorOnly;

  const handleClick = () => {
    if (!disabled) handleMenuItemClick(item.action);
  };

  return (
    <>
      <li className={clsx("menu-item", disabled && "menu-item-disabled")} onClick={handleClick}>
        <span>{item.name}</span>
        <span className="accelerator">{item.accelerator}</span>
      </li>
      {item.divider && <hr className="divider" />}
    </>
  );
};

export default MenuItem;
