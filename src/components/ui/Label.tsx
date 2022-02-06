import clsx from "clsx";
import React from "react";

interface Props {
  text: string;
  error?: string;
}

const Label: React.FC<Props> = ({ text, error }) => {
  return (
    <label className={clsx("label", error && "label-error")}>
      {text}
      {error && <span> - {error}</span>}
    </label>
  );
};

export default Label;
