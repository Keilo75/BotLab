import { DependencyList, EffectCallback, useEffect, useRef } from "react";

const useMountedEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      effect();
    } else {
      didMount.current = true;
    }
  }, deps);
};

export default useMountedEffect;
