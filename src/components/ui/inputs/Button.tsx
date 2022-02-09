import { TablerIcon } from "@tabler/icons";
import clsx from "clsx";
import React, { MouseEventHandler } from "react";

interface Props {
  type: "primary" | "transparent" | "success" | "red";
  text: string;
  textAlignment?: "center" | "left";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: TablerIcon;
  submit?: boolean;
  disabled?: boolean;
}

const Button: React.FC<Props> = ({
  type,
  onClick,
  text,
  textAlignment,
  icon: Icon,
  submit,
  disabled,
}) => {
  return (
    <button
      className={clsx("button", `button-${type}`, textAlignment && `button-text-${textAlignment}`)}
      onClick={onClick}
      type={submit ? "submit" : "button"}
      disabled={disabled}
    >
      {Icon && <Icon />}
      {text}
    </button>
  );
};

export default Button;
