import clsx from "clsx";
import React from "react";

interface Props {
  className?: string;
}

const Container: React.FC<Props> = ({ children, className }) => {
  return <div className={clsx("container", className)}>{children}</div>;
};

export default Container;
