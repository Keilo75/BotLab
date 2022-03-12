import React from "react";

interface Props {
  name: string;
  label: string;
  checked: boolean;
  onChange(checked: boolean, name?: string): void;
}

const Checkbox: React.FC<Props> = ({ name, label, checked, onChange }) => {
  const toggleValue = () => {
    onChange(!checked, name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") toggleValue();
  };

  return (
    <label className="checkbox">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={toggleValue}
        onKeyDown={handleKeyDown}
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
