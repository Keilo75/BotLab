import { useState } from "react";
import { ValidationError } from "src/lib/validater";

type LogStatus = "loading" | "success" | "error";

export interface Log {
  status: LogStatus;
  message: string;
  timestamp: number;
  updatedAt?: number;
  errors?: ValidationError[];
}

type LogPayload = Omit<Log, "timestamp">;

export interface LogsHandler {
  add: (payload: Partial<LogPayload>) => void;
  update: (payload: Partial<LogPayload>, index?: number) => void;
  clear: () => void;
}

const useLogs = (): [Log[], LogsHandler] => {
  const [logs, setLogs] = useState<Log[]>([]);

  const add = (payload: Partial<LogPayload>) => {
    setLogs((prev) => [
      ...prev,
      { status: "loading", message: "", ...payload, timestamp: Date.now() },
    ]);
  };

  const update = (payload: Partial<LogPayload>, target?: number) => {
    setLogs((prev) => {
      const targetIndex = target ?? prev.length - 1;
      return prev.map((log, index) =>
        index === targetIndex ? { ...log, ...payload, updatedAt: Date.now() } : log
      );
    });
  };

  const clear = () => setLogs([]);

  return [logs, { add, update, clear }];
};

export default useLogs;
