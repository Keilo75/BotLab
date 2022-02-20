import { IconChevronDown } from "@tabler/icons";
import clsx from "clsx";
import React, { useState } from "react";
import KeyboardList from "../keyboard-list/KeyboardList";
import Button from "./Button";

interface Props {
  text: string;
  options: string[];
  onClick?: (option: string) => void;
  className?: string;
  disabled?: boolean;
}

const DropdownButton: React.FC<Props> = ({ text, options, className, onClick, disabled }) => {
  const handleItemClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const option = e.currentTarget.getAttribute("data-option");

    if (option && onClick) {
      onClick(option);
      e.currentTarget.blur();
    }
  };

  return (
    <div className={clsx("dropdown-button", className)}>
      <Button
        type="primary"
        text={text}
        icon={IconChevronDown}
        textAlignment="left"
        iconAlignment="right"
      />

      <ul className="dropdown-button-list">
        <KeyboardList length={options.length} selectedIndex={0}>
          {(refs) =>
            options.map((option, index) => (
              <button
                key={option}
                data-option={option}
                onClick={handleItemClick}
                ref={(ref) => (refs[index].current = ref)}
              >
                {option}
              </button>
            ))
          }
        </KeyboardList>
      </ul>
    </div>
  );
};

export default DropdownButton;
