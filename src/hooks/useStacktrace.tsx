import { useEffect } from "react";
import { ValidationErrorScopeType } from "src/lib/validater";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";

const Stacktrace = (state: IInfoStore) => state.stacktrace;
const InfoActions = (state: IInfoStore) => state.actions;

const useStacktrace = (type: ValidationErrorScopeType, action: (id: string) => void) => {
  const stacktrace = InfoStore(Stacktrace);
  const { popStacktrace } = InfoStore(InfoActions);

  useEffect(() => {
    const [first] = stacktrace;

    if (first && first.type === type) {
      action(first.id);
      popStacktrace();
    }
  }, [stacktrace]);
};

export default useStacktrace;
