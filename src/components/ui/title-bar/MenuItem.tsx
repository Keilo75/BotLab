import clsx from "clsx";
import React from "react";

export interface MenuItemProps {
  name: string;
  accelerator?: string;
  disabled?: boolean;
  editorOnly?: boolean;
  divider?: boolean;
}

interface Props {
  item: MenuItemProps;
}

const MenuItem: React.FC<Props> = ({ item }) => {
  return (
    <>
      <li className={clsx("menu-item", item.editorOnly && "menu-item-disabled")}>
        <span>{item.name}</span>
        <span className="accelerator">{item.accelerator}</span>
      </li>
      {item.divider && <hr className="divider" />}
    </>
  );
};

export default MenuItem;
