import React from "react";
import { Check, X } from "tabler-icons-react";

interface StatusIconProps {
  status: "success" | "error" | "loading";
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  if (status === "success") return <Check className="status-icon status-icon-success" />;
  if (status === "error") return <X className="status-icon status-icon-error" />;
  if (status === "loading") return <div className="status-icon status-icon-loading" />;

  return null;
};

export default StatusIcon;
