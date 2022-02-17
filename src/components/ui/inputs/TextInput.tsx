import clsx from "clsx";
import React from "react";
import Label from "../Label";

interface Props {
  name: string;
  value: string;
  onChange(text: string, name?: string): void;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  error?: boolean;
}

const TextInput: React.FC<Props> = ({ name, value, onChange, className, type, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, name);
  };

  return (
    <input
      className={clsx("text-input", className, error && "text-input-error")}
      value={value}
      onChange={handleChange}
      type={type}
    />
  );
};

export default TextInput;
