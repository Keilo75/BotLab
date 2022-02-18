import { TablerIcon } from "@tabler/icons";
import React from "react";

interface Props {
  name: string;
  icon?: TablerIcon;
  className?: string;
  fullscreen?: boolean;
}

const Tab: React.FC<Props> = ({ name, children, fullscreen }) => {
  return (
    <>
      {!fullscreen && <h2>{name}</h2>}
      {children}
    </>
  );
};

export default Tab;
