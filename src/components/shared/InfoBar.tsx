import { Card, Text } from "@mantine/core";
import React, { useEffect } from "react";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import StatusIcon from "../ui/status-icon/StatusIcon";

const InfoMessage = (state: IInfoStore) => state.infoMessage;
const InfoActions = (state: IInfoStore) => state.actions;

const InfoBar: React.FC = () => {
  const infoMessage = InfoStore(InfoMessage);
  const { clearInfoMessage } = InfoStore(InfoActions);

  useEffect(() => {
    clearInfoMessage();
  }, []);

  return (
    <Card className="info-bar" p={0} withBorder>
      {infoMessage.status && <StatusIcon status={infoMessage.status} />}
      <Text ml={5}>{infoMessage.text}</Text>
    </Card>
  );
};

export default InfoBar;
