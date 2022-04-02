import { Group, Stack, Text } from "@mantine/core";
import React from "react";
import { Log } from "src/hooks/useLogs";
import StatusIcon from "../status-icon/StatusIcon";
import Timestamp from "../timestamp/Timestamp";

interface LogsProps {
  logs: Log[];
}

const Logs: React.FC<LogsProps> = ({ logs }) => {
  return (
    <Stack spacing={0}>
      {logs.map((log, index) => (
        <Group key={index} position="apart">
          <Group spacing={5}>
            <StatusIcon status={log.status} />
            <Timestamp timestamp={log.timestamp} />
            <Text>{log.message}</Text>
          </Group>
          {log.updatedAt && <Text color="dimmed">{log.updatedAt - log.timestamp}ms</Text>}
        </Group>
      ))}
    </Stack>
  );
};

export default Logs;
