import clsx from "clsx";
import React from "react";

interface Props {
  axis: "horizontal" | "vertical";
}

const ComponentGroup: React.FC<Props> = ({ children, axis }) => {
  return <div className={clsx("component-group", `component-group-${axis}`)}>{children}</div>;
};

export default ComponentGroup;
