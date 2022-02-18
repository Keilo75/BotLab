import { IconChevronDown } from "@tabler/icons";
import clsx from "clsx";
import React, { useState } from "react";
import useKeyboardClick from "src/hooks/useKeyboardClick";
import KeyboardList from "../keyboard-list/KeyboardList";
import Button from "./Button";

interface Props {
  text: string;
  options: string[];
  onClick?: (option: string) => void;
  className?: string;
}

const DropdownButton: React.FC<Props> = ({ text, options, className, onClick }) => {
  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const option = e.currentTarget.getAttribute("data-option");

    if (option && onClick) onClick(option);
  };

  return (
    <div className={clsx("dropdown-button", className)}>
      <Button type="primary" text={text} icon={IconChevronDown} textAlignment="left" />

      <ul className="dropdown-button-list">
        {options.map((option) => (
          <li key={option} data-option={option} onClick={handleItemClick}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownButton;
