import { useEffect, useCallback, useRef } from "react";

const useOutsideClick = (
  selector: string,
  callback: Function,
  dependency: boolean = true
): void => {
  const cb = useRef(callback);
  const dep = useRef(dependency);

  useEffect(() => {
    dep.current = dependency;
  }, [dependency]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dep.current) {
        const target = e.target as HTMLElement;

        if (!target.closest(selector)) cb.current();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
};

export default useOutsideClick;
