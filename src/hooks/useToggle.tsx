import React, { useState } from "react";

type useToggleReturnValue = [boolean, () => void];

const useToggle = (initialValue: boolean): useToggleReturnValue => {
  const [value, setValue] = useState(initialValue);

  const toggleValue = () => {
    setValue((prev) => !prev);
  };

  return [value, toggleValue];
};

export default useToggle;
