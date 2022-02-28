import { IconAlertCircle, IconInfoCircle } from "@tabler/icons";
import clsx from "clsx";
import React from "react";

interface Props {
  type: "warning" | "info";
  text?: string;
  className?: string;
}

const Container: React.FC<Props> = ({ type, text, className, children }) => {
  return (
    <div className={clsx("container", "info-container", `info-container-${type}`, className)}>
      {type === "warning" && <IconAlertCircle />}
      {type === "info" && <IconInfoCircle />}
      <div>{children || text}</div>
    </div>
  );
};

export default Container;
