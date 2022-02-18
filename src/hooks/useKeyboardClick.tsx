import React, { useState } from "react";

type useKeyboardClickReturnValue = {
  onClick: React.MouseEventHandler;
  onKeyDown: React.KeyboardEventHandler;
};

interface useKeyboardClickOptions {
  preventDefault?: boolean;
}

const useKeyboardClick = <T extends HTMLElement>(
  callback: (element: T) => void,
  options?: useKeyboardClickOptions
): useKeyboardClickReturnValue => {
  const onClick = (e: React.MouseEvent<T>) => {
    if (options?.preventDefault) e.preventDefault();

    callback(e.currentTarget);
  };

  const onKeyDown = (e: React.KeyboardEvent<T>) => {
    if (e.key === "Enter" || e.key === " ") {
      if (options?.preventDefault) e.preventDefault();
      callback(e.currentTarget);
    }
  };

  return { onClick, onKeyDown };
};

export default useKeyboardClick;
