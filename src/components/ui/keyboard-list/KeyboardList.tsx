import React, { useCallback, useEffect, useMemo, useState } from "react";

type Ref = HTMLElement | null;

interface Props {
  length: number;
  children: (refs: React.MutableRefObject<Ref>[]) => JSX.Element[];
  selectedIndex: number;
  axis?: "vertical" | "horizontal";
}

const KeyboardList: React.FC<Props> = ({ length, children, selectedIndex, axis = "vertical" }) => {
  const [focused, setFocused] = useState(selectedIndex);

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

      const setNextIndex = () => {
        newIndex = Math.min(focused + 1, length - 1);
      };

      const setPreviousIndex = () => {
        newIndex = Math.max(focused - 1, 0);
      };

      switch (e.key) {
        case "ArrowDown": {
          if (axis == "vertical") setNextIndex();
          break;
        }

        case "ArrowUp": {
          if (axis == "vertical") setPreviousIndex();
          break;
        }

        case "ArrowRight": {
          if (axis == "horizontal") setNextIndex();
          break;
        }

        case "ArrowLeft": {
          if (axis == "horizontal") setPreviousIndex();
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

        case "Enter":
        case "Space": {
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
    setFocused(selectedIndex);
  }, [selectedIndex, setFocused]);

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
  }, [focused, keydownHandler, blurHandler]);

  return <>{children(refs)}</>;
};

export default KeyboardList;
