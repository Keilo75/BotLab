import React from "react";

interface State {
  [key: string]: string;
}

interface Props {
  state: State;
}

const InputGroup: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default InputGroup;
