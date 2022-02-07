import React from "react";

interface Props {
  name: string;
  label: string;
  checked: boolean;
  onChange(checked: boolean, name?: string): void;
}
const ToggleSwitch: React.FC<Props> = ({ name, label, checked, onChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.code) {
      case "Enter":
      case "Space":
        handleToggleSwitch();
        break;
    }
  };

  const handleToggleSwitch = () => {
    onChange(!checked, name);
  };

  return (
    <div
      className="toggle-switch-container"
      tabIndex={0}
      onClick={handleToggleSwitch}
      onKeyDown={handleKeyDown}
    >
      <label>{label}</label>
      <label className="toggle">
        <input type="checkbox" tabIndex={-1} checked={checked} readOnly />
        <span className="toggle-slider" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
