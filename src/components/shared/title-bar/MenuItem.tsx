import { Divider, Text } from "@mantine/core";
import clsx from "clsx";
import React from "react";
import { MenuAction } from "src/models/menu-action";
import { ContextMenuItemProps } from "src/stores/ContextMenuStore";

export interface MenuItemProps {
  name: string;
  action: MenuAction;
  accelerator?: string;
  disabled?: boolean;
  editorOnly?: boolean;
  divider?: boolean;
}

type Props =
  | {
      scope: "title-bar";
      item: MenuItemProps;
      handleMenuItemClick: (action: MenuAction) => void;
    }
  | {
      scope: "context-menu";
      item: ContextMenuItemProps;
      handleMenuItemClick: (name: string) => void;
    };

const MenuItem: React.FC<Props> = ({ scope, item, handleMenuItemClick }) => {
  const disabled =
    item.disabled ||
    (scope === "title-bar" && item.editorOnly && !window.location.href.includes("editor"));

  const handleClick = () => {
    if (!disabled) {
      if (scope === "title-bar") handleMenuItemClick(item.action);
      else handleMenuItemClick(item.name);
    }
  };

  return (
    <>
      <li className={clsx("menu-item", disabled && "menu-item-disabled")} onClick={handleClick}>
        <Text>{item.name}</Text>
        {scope === "title-bar" && item.accelerator && (
          <Text color="dimmed">{item.accelerator}</Text>
        )}
      </li>
      {item.divider && <Divider m="xs" />}
    </>
  );
};

export default MenuItem;
