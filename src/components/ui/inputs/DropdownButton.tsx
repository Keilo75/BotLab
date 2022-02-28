import { IconChevronDown } from "@tabler/icons";
import clsx from "clsx";
import React, { useMemo } from "react";
import useOutsideClick from "src/hooks/useOutsideClick";
import useToggle from "src/hooks/useToggle";
import KeyboardList from "../keyboard-list/KeyboardList";
import Button from "./Button";

interface Props {
  text: string;
  options: string[];
  onClick?: (option: string) => void;
  className?: string;
}

const DropdownButton: React.FC<Props> = ({ text, options, className, onClick }) => {
  const [visible, toggleVisible, setVisible] = useToggle(false);

  const remainingOptions = useMemo(() => {
    const [, ...remaining] = options;

    return remaining;
  }, [options]);

  const handleFirstItemClick = () => {
    const firstOption = options[0];
    if (firstOption && onClick) onClick(firstOption);
  };

  useOutsideClick(".dropdown-button", () => setVisible(false), visible);

  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    setVisible(false);

    const option = e.currentTarget.getAttribute("data-option");
    if (option && onClick) onClick(option);
  };

  return (
    <div className={clsx("dropdown-button", className)}>
      <Button
        type="primary"
        text={text}
        textAlignment="left"
        className="default-button"
        onClick={handleFirstItemClick}
      />
      <Button
        type="primary"
        icon={IconChevronDown}
        square
        className="more-button"
        onClick={toggleVisible}
      />
      {visible && (
        <ul className="dropdown-list">
          <KeyboardList length={remainingOptions.length} selectedIndex={0}>
            {(refs) =>
              remainingOptions.map((option, index) => (
                <li
                  key={option}
                  ref={(ref) => (refs[index].current = ref)}
                  onClick={handleItemClick}
                  data-option={option}
                >
                  {option}
                </li>
              ))
            }
          </KeyboardList>
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;
