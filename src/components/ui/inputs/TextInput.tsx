import clsx from "clsx";
import React from "react";

interface Props {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

const TextInput: React.FC<Props> = ({ value, onChange, className }) => {
  return <input className={clsx("text-input", className)} value={value} onChange={onChange} />;
};

export default TextInput;
