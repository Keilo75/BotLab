import React from "react";

interface Props {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactElement;
}

const Wrapper: React.FC<Props> = ({ condition, wrapper, children }) => {
  if (condition) return wrapper(children);

  return <>{children}</>;
};

export default Wrapper;
