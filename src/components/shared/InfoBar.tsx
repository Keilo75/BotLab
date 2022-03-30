import { Card, useMantineTheme } from "@mantine/core";
import React, { useEffect } from "react";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { Check, X } from "tabler-icons-react";

const InfoMessage = (state: IInfoStore) => state.infoMessage;
const InfoActions = (state: IInfoStore) => state.actions;

const InfoBar: React.FC = () => {
  const theme = useMantineTheme();

  const infoMessage = InfoStore(InfoMessage);
  const { clearInfoMessage } = InfoStore(InfoActions);

  useEffect(() => {
    clearInfoMessage();
  }, []);

  return (
    <Card className="info-bar" p={0} withBorder>
      {infoMessage.type === "success" && <Check className="icon" color={theme.colors.green[8]} />}
      {infoMessage.type === "error" && <X className="icon" color={theme.colors.red[8]} />}
      {infoMessage.type === "loading" && <div className="icon icon-loading" />}
      {infoMessage.text}
    </Card>
  );
};

export default InfoBar;
