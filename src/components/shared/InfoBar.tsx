import { IconCheck, IconX } from "@tabler/icons";
import React, { useCallback } from "react";
import { InfoBarStore } from "src/stores/InfoBarStore";

const InfoBar: React.FC = () => {
  const [text, type] = InfoBarStore(useCallback((state) => [state.text, state.type], []));

  return (
    <div className="info-bar">
      {type === "success" && <IconCheck className="icon icon-success" />}
      {type === "error" && <IconX className="icon icon-error" />}
      {type === "loading" && <div className="icon icon-loading" />}
      {text}
    </div>
  );
};

export default InfoBar;
