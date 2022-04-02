import { useState } from "react";

type LogStatus = "loading" | "success" | "error";

export interface Log {
  status: LogStatus;
  message: string;
  timestamp: number;
  updatedAt?: number;
}

type LogPayload = Omit<Log, "timestamp">;

interface LogsHandler {
  add: (payload: LogPayload) => void;
  update: (payload: Partial<LogPayload>, index?: number) => void;
}

const useLogs = (): [Log[], LogsHandler] => {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = (payload: LogPayload) => {
    setLogs((prev) => [...prev, { ...payload, timestamp: Date.now() }]);
  };

  const updateLog = (payload: Partial<LogPayload>, index?: number) => {
    const target = index ?? logs.length;
    setLogs((prev) =>
      prev.map((log, index) =>
        index === target ? { ...log, ...payload, updatedAt: Date.now() } : log
      )
    );
  };

  return [logs, { add: addLog, update: updateLog }];
};

export default useLogs;
