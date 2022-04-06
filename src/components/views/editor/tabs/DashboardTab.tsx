import { Anchor, Button, Card, Group, Stack, Text } from "@mantine/core";
import React from "react";
import StatusIcon from "src/components/ui/status-icon/StatusIcon";
import Timestamp from "src/components/ui/timestamp/Timestamp";
import { Log, LogsHandler } from "src/hooks/useLogs";
import { BotStatus } from "src/models/bot";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { PlayerPlay } from "tabler-icons-react";

const InfoActions = (state: IInfoStore) => state.actions;

interface DashboardTabProps {
  logs: Log[];
  logsHandler: LogsHandler;
  startBot: () => Promise<void>;
  botStatus: BotStatus;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ logs, logsHandler, startBot, botStatus }) => {
  const { setStacktrace } = InfoStore(InfoActions);

  const handleStacktraceClick = (e: React.MouseEvent) => {
    if (!logs) return;

    const logIndex = parseInt(e.currentTarget.getAttribute("data-log-index")!);
    const stacktraceIndex = parseInt(e.currentTarget.getAttribute("data-stacktrace-index")!);

    const stacktrace = logs[logIndex].stacktrace;
    if (!stacktrace) return;

    const slicedStacktrace = stacktrace.slice(0, stacktraceIndex);
    setStacktrace(slicedStacktrace);
  };

  const clearLogs = () => logsHandler.clear();

  return (
    <Stack className="main-content in-editor dashboard" mt="md" spacing={0}>
      <Group position="apart" align="center">
        <Button
          leftIcon={<PlayerPlay size={16} />}
          color="teal"
          onClick={startBot}
          loading={botStatus === "starting"}
        >
          Start Bot
        </Button>
        <Button variant="default" onClick={clearLogs}>
          Clear Logs
        </Button>
      </Group>
      <Text weight={500} color="gray" mt="md">
        Logs
      </Text>
      <Card className="logs">
        <Stack spacing={0}>
          {logs.length > 0 ? (
            logs.map((log, logIndex) => (
              <Group key={logIndex} position="apart">
                <Group spacing={5} align="flex-start">
                  <div className="log-icon">
                    <StatusIcon status={log.status} />
                  </div>

                  <Timestamp timestamp={log.timestamp} />
                  <Stack spacing={0}>
                    <Text>{log.message}</Text>
                    {log.stacktrace &&
                      [...log.stacktrace].reverse().map((scope, stacktraceIndex, array) => (
                        <Text key={stacktraceIndex} color="dimmed">
                          at{" "}
                          <Anchor
                            onClick={handleStacktraceClick}
                            data-log-index={logIndex}
                            data-stacktrace-index={array.length - stacktraceIndex}
                          >
                            {scope.type}
                          </Anchor>
                        </Text>
                      ))}
                  </Stack>
                </Group>
                {log.updatedAt && <Text color="dimmed">{log.updatedAt - log.timestamp}ms</Text>}
              </Group>
            ))
          ) : (
            <Text>No logs.</Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default DashboardTab;
