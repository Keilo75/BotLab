import { IconCheck, IconX } from "@tabler/icons";
import React, { useEffect } from "react";
import { IInfoStore, InfoStore } from "src/stores/InfoStore";

const InfoMessage = (state: IInfoStore) => state.infoMessage;
const InfoActions = (state: IInfoStore) => state.actions;

const InfoBar: React.FC = () => {
  const infoMessage = InfoStore(InfoMessage);
  const { clearInfoMessage } = InfoStore(InfoActions);

  useEffect(() => {
    clearInfoMessage();
  }, []);

  return (
    <div className="info-bar">
      {infoMessage.type === "success" && <IconCheck className="icon icon-success" />}
      {infoMessage.type === "error" && <IconX className="icon icon-error" />}
      {infoMessage.type === "loading" && <div className="icon icon-loading" />}
      {infoMessage.text}
    </div>
  );
};

export default InfoBar;
