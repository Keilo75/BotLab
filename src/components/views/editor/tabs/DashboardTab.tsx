import { Button, Card, Group, Paper, Stack, Text, Title } from "@mantine/core";
import React, { useState } from "react";
import StatusIcon from "src/components/ui/status-icon/StatusIcon";
import Timestamp from "src/components/ui/timestamp/Timestamp";
import useLogs from "src/hooks/useLogs";
import { Tool } from "tabler-icons-react";

interface DashboardTabProps {
  projectPath: string;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ projectPath }) => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [logs, logsHandler] = useLogs();

  const handleStartSetup = async () => {
    setIsSettingUp(true);

    logsHandler.add({ status: "loading", message: "Check environment" });
    const isNpmInstalled = await window.bot.isNpmInstalled();
    if (!isNpmInstalled) {
      logsHandler.update({ status: "error", message: "Could not find npm installation" });
      setIsSettingUp(false);
      return;
    }
    logsHandler.update({ status: "success" });

    logsHandler.add({ status: "loading", message: "Copy files" });
    try {
      await window.bot.copyFiles(projectPath);
    } catch {
      logsHandler.update({ status: "error", message: "Could not copy files" });
      setIsSettingUp(false);
      return;
    }
    logsHandler.update({ status: "success" });

    logsHandler.add({ status: "loading", message: "Install dependencies" });
    try {
      await window.bot.installDependencies(projectPath);
    } catch {
      logsHandler.update({ status: "error", message: "Could not install dependencies" });
      setIsSettingUp(false);
      return;
    }
    logsHandler.update({ status: "success" });

    setIsSettingUp(false);
  };

  return (
    <Stack className="main-content in-editor dashboard" mt="md">
      <Paper withBorder p="md">
        <Group position="apart" align="center">
          <Group direction="column" spacing={0}>
            <Title order={3}>Setup Bot Folder</Title>
            <Text>
              Before you can run your bot, you need to install all neccessary dependencies.
            </Text>
          </Group>
          <Button leftIcon={<Tool size={16} />} onClick={handleStartSetup} loading={isSettingUp}>
            Setup Bot Folder
          </Button>
        </Group>
        {logs.length > 0 && (
          <Card className="logs">
            <Stack spacing={0}>
              {logs.map((log, index) => (
                <Group key={index} position="apart">
                  <Group spacing={5}>
                    <div className="log-icon">
                      <StatusIcon status={log.status} />
                    </div>

                    <Timestamp timestamp={log.timestamp} />
                    <Text>{log.message}</Text>
                  </Group>
                  {log.updatedAt && <Text color="dimmed">{log.updatedAt - log.timestamp}ms</Text>}
                </Group>
              ))}
            </Stack>
          </Card>
        )}
      </Paper>
    </Stack>
  );
};

export default DashboardTab;
