import clsx from "clsx";
import React from "react";

interface Props {
  axis: "horizontal" | "vertical";
  className?: string;
}

const ComponentGroup: React.FC<Props> = ({ children, axis, className }) => {
  return (
    <div className={clsx("component-group", `component-group-${axis}`, className)}>{children}</div>
  );
};

export default ComponentGroup;
