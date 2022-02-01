import clsx from "clsx";
import React from "react";

export interface MenuItemProps {
  name: string;
  accelerator?: string;
  disabledAtHome?: true;
}

interface Props {
  item: MenuItemProps;
}

const MenuItem: React.FC<Props> = ({ item }) => {
  return (
    <li className={clsx("menu-item", item.disabledAtHome && "menu-item-disabled")}>
      <span>{item.name}</span>
      <span className="accelerator">{item.accelerator}</span>
    </li>
  );
};

export default MenuItem;
