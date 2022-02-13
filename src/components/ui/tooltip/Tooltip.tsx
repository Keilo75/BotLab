import clsx from "clsx";
import React, { useState } from "react";

export type TooltipDirection = "top" | "bottom" | "right" | "left";

interface Props {
  children: JSX.Element;
  content: string;
  direction?: TooltipDirection;
}

const Tooltip: React.FC<Props> = ({ children, content, direction = "top" }) => {
  if (!content) return null;

  return (
    <div data-tooltip={content} className={clsx(`tooltip-${direction}`)}>
      {children}
    </div>
  );
};

export default Tooltip;
