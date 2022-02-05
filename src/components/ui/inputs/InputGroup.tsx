import React, { useState } from "react";

interface Props<T> {
  state: T;
  onChange(value: T): void;
  children(state: T, setState: (value: any, name: string) => void): React.ReactElement;
}

const InputGroup = <T extends object>({ state: stateProps, onChange, children }: Props<T>) => {
  const [state, setState] = useState(stateProps);

  const handleStateChange = (value: any, name: string) => {
    const newState = { ...state, [name]: value };
    setState(newState);
    onChange(newState);
  };

  return <>{children(state, handleStateChange)}</>;
};

export default InputGroup;
