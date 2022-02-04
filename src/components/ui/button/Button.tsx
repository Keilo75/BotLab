import clsx from "clsx";
import React, { MouseEventHandler } from "react";

interface Props {
  type: "primary" | "transparent";
  text: string;
  textAlignment?: "center" | "left";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<Props> = ({ children, type, onClick, text, textAlignment }) => {
  return (
    <button
      className={clsx("button", `button-${type}`, textAlignment && `button-text-${textAlignment}`)}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
