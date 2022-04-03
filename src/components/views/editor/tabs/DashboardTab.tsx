import { Anchor, Button, Card, Group, Stack, Text } from "@mantine/core";
import React from "react";
import StatusIcon from "src/components/ui/status-icon/StatusIcon";
import Timestamp from "src/components/ui/timestamp/Timestamp";
import { Log } from "src/hooks/useLogs";
import { BotStatus } from "src/models/bot";
import { PlayerPlay } from "tabler-icons-react";

interface DashboardTabProps {
  logs: Log[];
  startBot: () => Promise<void>;
  botStatus: BotStatus;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ logs, startBot, botStatus }) => {
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
      </Group>
      <Text weight={500} color="gray" mt="md">
        Logs
      </Text>
      <Card className="logs">
        <Stack spacing={0}>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <Group key={index} position="apart">
                <Group spacing={5} align="flex-start">
                  <div className="log-icon">
                    <StatusIcon status={log.status} />
                  </div>

                  <Timestamp timestamp={log.timestamp} />
                  <Stack spacing={0}>
                    <Text>{log.message}</Text>
                    {log.stacktrace &&
                      log.stacktrace.map((scope, index) => (
                        <Text key={index} color="dimmed">
                          at{" "}
                          <Anchor>
                            {scope.type} {scope.name}
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
