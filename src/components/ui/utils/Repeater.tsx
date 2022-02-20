import React from "react";

interface Props {
  children: JSX.Element;
  times: number;
}

const Repeater: React.FC<Props> = ({ children, times }) => {
  if (times === 0) return null;

  const elements: JSX.Element[] = [];

  for (let i = 0; i < times; i++) {
    elements.push(children);
  }

  return <>{elements}</>;
};

export default Repeater;
