import { Button, Card, Group, Paper, Stack, Text, Title } from "@mantine/core";
import React, { useState } from "react";
import Logs from "src/components/ui/logs/Logs";
import Timestamp from "src/components/ui/timestamp/Timestamp";
import useLogs from "src/hooks/useLogs";
import { Tool } from "tabler-icons-react";

interface DashboardTabProps {
  isBotFolderSetUp: boolean;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ isBotFolderSetUp }) => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupLogs, setupLogsHandler] = useLogs();

  const handleStartSetup = async () => {
    setIsSettingUp(true);

    setupLogsHandler.add({ status: "loading", message: "Check environment" });
    const isNpmInstalled = await window.bot.isNpmInstalled();
    if (!isNpmInstalled) {
      setupLogsHandler.update({ status: "error", message: "Could not find npm installation" });
      setIsSettingUp(false);
      return;
    }
    setupLogsHandler.update({ status: "success" });

    setupLogsHandler.add({ status: "loading", message: "Copy files" });
  };

  return (
    <Stack className="main-content in-editor" mt="md">
      {!isBotFolderSetUp && (
        <Paper withBorder p="md">
          <Group position="apart" align="center">
            <Group direction="column" spacing={0}>
              <Title order={3}>Install Dependencies</Title>
              <Text>
                Before you can run your bot, you need to install all neccessary dependencies.
              </Text>
            </Group>
            <Button leftIcon={<Tool size={16} />} onClick={handleStartSetup} loading={isSettingUp}>
              Setup Bot Folder
            </Button>
          </Group>
          {setupLogs.length > 0 && (
            <Card>
              <Logs logs={setupLogs} />
            </Card>
          )}
        </Paper>
      )}
    </Stack>
  );
};

export default DashboardTab;
