import clsx from "clsx";
import React from "react";
import Label from "../Label";

interface Props {
  name: string;
  value: string;
  onChange(text: string, name?: string): void;
  className?: string;
}

const TextInput: React.FC<Props> = ({ name, value, onChange, className }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, name);
  };

  return <input className={clsx("text-input", className)} value={value} onChange={handleChange} />;
};

export default TextInput;
