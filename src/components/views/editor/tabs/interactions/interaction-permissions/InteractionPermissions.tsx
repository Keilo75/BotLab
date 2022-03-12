import React from "react";
import Checkbox from "src/components/ui/inputs/Checkbox";
import { InteractionPermission } from "src/models/interactions";

interface Props {
  permissions: InteractionPermission;
  handlePermissionChange: (permissions: InteractionPermission) => void;
}

const InteractionPermissions: React.FC<Props> = ({ permissions, handlePermissionChange }) => {
  const handleDisabledByDefaultToggle = (value: boolean) => {
    handlePermissionChange({ ...permissions, disabledByDefault: value });
  };

  return (
    <div className="container">
      <Checkbox
        name="disabledByDefault"
        checked={permissions.disabledByDefault}
        onChange={handleDisabledByDefaultToggle}
        label="Hi"
      />
    </div>
  );
};

export default InteractionPermissions;
