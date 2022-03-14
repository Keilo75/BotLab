import { Divider, Text } from "@mantine/core";
import clsx from "clsx";
import React from "react";
import { useLocation } from "react-router-dom";
import { MenuAction } from "src/models/menu-action";

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
  const location = useLocation();
  const disabled = item.disabled || (item.editorOnly && !location.pathname.includes("editor"));

  const handleClick = () => {
    if (!disabled) handleMenuItemClick(item.action);
  };

  return (
    <>
      <li className={clsx("menu-item", disabled && "menu-item-disabled")} onClick={handleClick}>
        <Text>{item.name}</Text>
        {item.accelerator && <Text color="dimmed">{item.accelerator}</Text>}
      </li>
      {item.divider && <Divider m="xs" />}
    </>
  );
};

export default MenuItem;
