import React from "react";

interface Props {
  name: string;
}

const Tab: React.FC<Props> = ({ name, children }) => {
  return (
    <>
      <h2>{name}</h2>
      {children}
    </>
  );
};

export default Tab;
