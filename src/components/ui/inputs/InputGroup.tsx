import React from "react";

interface Props<T> {
  state: T;
  onChange(value: T): void;
  children(
    state: T,
    setState: <N extends keyof T>(value: T[N], name: N) => void
  ): React.ReactElement;
}

const InputGroup = <T extends object>({ state, onChange, children }: Props<T>) => {
  const handleStateChange = <N extends keyof T>(value: T[N], name: N) => {
    const newState = { ...state, [name]: value };
    onChange(newState);
  };

  return <>{children(state, handleStateChange)}</>;
};

export default InputGroup;
