import React, { useCallback, useEffect, useMemo, useState } from "react";

type Ref = HTMLElement | null;

interface Props {
  length: number;
  render(refs: React.MutableRefObject<Ref>[]): JSX.Element[];
  selected: number;
}

const KeyboardList: React.FC<Props> = ({ length, render, selected }) => {
  const [focused, setFocused] = useState(selected);

  const refs = useMemo(
    () =>
      Array(length)
        .fill(0)
        .map((_) => React.createRef<Ref>()),
    [length]
  ) as React.MutableRefObject<Ref>[];

  const keydownHandler = useCallback(
    (e: KeyboardEvent) => {
      let newIndex;

      switch (e.key) {
        case "ArrowDown": {
          newIndex = Math.min(focused + 1, length - 1);
          break;
        }

        case "ArrowUp": {
          newIndex = Math.max(focused - 1, 0);
          break;
        }

        case "Home": {
          newIndex = 0;
          break;
        }

        case "End": {
          newIndex = length - 1;
          break;
        }

        case "Enter": {
          refs[focused].current?.click();
        }
      }

      if (newIndex !== undefined) {
        refs[newIndex].current?.focus();
        setFocused(newIndex);
      }
    },
    [focused, setFocused]
  );

  const blurHandler = useCallback(() => {
    setFocused(selected);
  }, []);

  useEffect(() => {
    for (let i = 0; i < length; i++) {
      const element = refs[i].current;

      if (element) element.tabIndex = -1;
    }
  }, []);

  useEffect(() => {
    const element = refs[focused].current;
    if (element) {
      element.addEventListener("keydown", keydownHandler);
      element.addEventListener("blur", blurHandler);
      element.tabIndex = 0;
    }

    return () => {
      // Remove all event listeners
      const element = refs[focused].current;
      if (element) {
        element.removeEventListener("keydown", keydownHandler);
        element.removeEventListener("blur", blurHandler);
        element.tabIndex = -1;
      }
    };
  }, [focused, keydownHandler]);

  return <>{render(refs)}</>;
};

export default KeyboardList;
