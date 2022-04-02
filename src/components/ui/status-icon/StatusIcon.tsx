import clsx from "clsx";
import React from "react";
import { Check, X } from "tabler-icons-react";

interface StatusIconProps {
  status: "success" | "error" | "loading";
  className?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, className }) => {
  if (status === "success")
    return <Check className={clsx("status-icon status-icon-success", className)} />;
  if (status === "error") return <X className={clsx("status-icon status-icon-error", className)} />;
  if (status === "loading")
    return <div className={clsx("status-icon status-icon-loading", className)} />;

  return null;
};

export default StatusIcon;
