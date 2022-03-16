import { Paper } from "@mantine/core";
import React, { useEffect } from "react";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";
import { Check, X } from "tabler-icons-react";

const InfoMessage = (state: IInfoStore) => state.infoMessage;
const InfoActions = (state: IInfoStore) => state.actions;

const InfoBar: React.FC = () => {
  const infoMessage = InfoStore(InfoMessage);
  const { clearInfoMessage } = InfoStore(InfoActions);

  useEffect(() => {
    clearInfoMessage();
  }, []);

  return (
    <Paper className="info-bar" withBorder>
      {infoMessage.type === "success" && <Check className="icon icon-success" />}
      {infoMessage.type === "error" && <X className="icon icon-error" />}
      {infoMessage.type === "loading" && <div className="icon icon-loading" />}
      {infoMessage.text}
    </Paper>
  );
};

export default InfoBar;
