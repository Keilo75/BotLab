import { IconCheck, IconX } from "@tabler/icons";
import React, { useCallback, useEffect } from "react";
import { InfoStore } from "src/stores/InfoStore";
import shallow from "zustand/shallow";

const InfoBar: React.FC = () => {
  const [info, clearInfoMessage] = InfoStore(
    useCallback((state) => [state.infoMessage, state.clearInfoMessage], []),
    shallow
  );

  useEffect(() => {
    clearInfoMessage();
  }, []);

  return (
    <div className="info-bar">
      {info.type === "success" && <IconCheck className="icon icon-success" />}
      {info.type === "error" && <IconX className="icon icon-error" />}
      {info.type === "loading" && <div className="icon icon-loading" />}
      {info.text}
    </div>
  );
};

export default InfoBar;
