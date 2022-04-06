import { useEffect } from "react";
import { ValidationErrorScopeType } from "src/lib/validater";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";

const Stacktrace = (state: IInfoStore) => state.stacktrace;
const InfoActions = (state: IInfoStore) => state.actions;

type StacktraceAction = (payload: {
  id: string;
  finishStacktrace: () => void;
  key?: string;
}) => void;

const useStacktrace = (type: ValidationErrorScopeType, action: StacktraceAction) => {
  const stacktrace = InfoStore(Stacktrace);
  const { removeErrorScope } = InfoStore(InfoActions);

  useEffect(() => {
    const [first] = stacktrace;

    if (first && first.type === type) {
      const finishStacktrace = () => removeErrorScope(type);

      action({ id: first.id, finishStacktrace, key: first.key });
    }
  }, [stacktrace]);
};

export default useStacktrace;
