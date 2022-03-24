import React from "react";
import { InteractionType } from "src/models/interactions";
import { CalendarEvent, Folder, IconProps, Mail, User } from "tabler-icons-react";

interface InteractionTypeIconProps {
  type: InteractionType;
  iconProps?: IconProps;
}

const InteractionTypeIcon: React.FC<InteractionTypeIconProps> = ({ type, iconProps }) => {
  if (type === "folder") return <Folder {...iconProps} />;
  if (type === "message-context-menu") return <Mail {...iconProps} />;
  if (type === "user-context-menu") return <User {...iconProps} />;
  if (type === "event") return <CalendarEvent {...iconProps} />;

  return null;
};

export default InteractionTypeIcon;
