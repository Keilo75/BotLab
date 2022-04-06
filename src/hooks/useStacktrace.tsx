import { useEffect } from "react";
import { ValidationErrorScopeType } from "src/lib/validater";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";

const Stacktrace = (state: IInfoStore) => state.stacktrace;
const InfoActions = (state: IInfoStore) => state.actions;

interface StacktraceActionPayload {
  id: string;
  finishStacktrace: () => void;
  key?: string;
}

interface StacktraceOptions {
  inModal?: boolean;
}

const useStacktrace = (
  type: ValidationErrorScopeType,
  action: (payload: StacktraceActionPayload) => void,
  options?: StacktraceOptions
) => {
  const stacktrace = InfoStore(Stacktrace);
  const { removeErrorScope } = InfoStore(InfoActions);

  useEffect(() => {
    const [first] = stacktrace;

    if (first && first.type === type) {
      const finishStacktrace = () => removeErrorScope(type);
      const payload: StacktraceActionPayload = { id: first.id, finishStacktrace, key: first.key };

      if (options?.inModal) setTimeout(() => action(payload));
      else action(payload);
    }
  }, [stacktrace]);
};

export default useStacktrace;
