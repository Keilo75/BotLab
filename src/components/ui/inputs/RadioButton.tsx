import clsx from "clsx";
import React from "react";
import KeyboardList from "../keyboard-list/KeyboardList";

interface Props {
  name: string;
  selectedIndex: number;
  onChange(index: number, name?: string): void;
  options: string[];
  axis?: "horizontal" | "vertical";
}

const RadioButton: React.FC<Props> = ({
  selectedIndex,
  onChange,
  options,
  axis = "vertical",
  name,
}) => {
  const handleRadioButtonClick = (e: React.MouseEvent) => {
    const index = e.currentTarget.getAttribute("data-radio-option-index");
    if (index) onChange(parseInt(index), name);
  };

  return (
    <div className={clsx("radio-button-container", `radio-button-${axis}`)}>
      <KeyboardList selectedIndex={selectedIndex} length={options.length}>
        {(refs) =>
          options.map((option, index) => (
            <div
              key={option}
              className={clsx("radio-button", selectedIndex == index && "radio-button-selected")}
              ref={(ref) => (refs[index].current = ref)}
              data-radio-option-index={index}
              onClick={handleRadioButtonClick}
            >
              <i className="circle" />
              <span>{option}</span>
            </div>
          ))
        }
      </KeyboardList>
    </div>
  );
};

export default RadioButton;
