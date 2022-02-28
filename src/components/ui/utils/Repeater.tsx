import React from "react";

interface Props {
  children: React.ReactElement;
  times: number;
}

const Repeater: React.FC<Props> = ({ children, times }) => {
  if (times === 0) return null;

  const elements: React.ReactElement[] = [];

  for (let i = 0; i < times; i++) {
    elements.push(children);
  }

  return <>{elements}</>;
};

export default Repeater;
