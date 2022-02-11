import { IconAlertTriangle } from "@tabler/icons";
import clsx from "clsx";
import React from "react";

interface Props {
  type: "warning";
  text: string;
  className?: string;
}

const Container: React.FC<Props> = ({ type, text, className }) => {
  return (
    <div className={clsx("container", "info-container", `info-container-${type}`, className)}>
      {type == "warning" && <IconAlertTriangle />}
      <div>{text}</div>
    </div>
  );
};

export default Container;
