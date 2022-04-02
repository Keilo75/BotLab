import { useState } from "react";

type LogStatus = "loading" | "success" | "error";

export interface Log {
  status: LogStatus;
  message: string;
  timestamp: number;
  updatedAt?: number;
}

type LogPayload = Omit<Log, "timestamp">;

export interface LogsHandler {
  add: (payload: LogPayload) => void;
  update: (payload: Partial<LogPayload>, index?: number) => void;
}

const useLogs = (): [Log[], LogsHandler] => {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = (payload: LogPayload) => {
    setLogs((prev) => [...prev, { ...payload, timestamp: Date.now() }]);
  };

  const updateLog = (payload: Partial<LogPayload>, target?: number) => {
    setLogs((prev) => {
      const targetIndex = target ?? prev.length - 1;
      return prev.map((log, index) =>
        index === targetIndex ? { ...log, ...payload, updatedAt: Date.now() } : log
      );
    });
  };

  return [logs, { add: addLog, update: updateLog }];
};

export default useLogs;
