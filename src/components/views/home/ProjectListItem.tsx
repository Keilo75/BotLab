import { IconFolder, IconTrash } from "@tabler/icons";
import React from "react";
import Button from "src/components/ui/inputs/Button";
import Tooltip from "src/components/ui/tooltip/Tooltip";
import ComponentGroup from "src/components/ui/utils/ComponentGroup";
import { getTimeSince } from "src/lib/getTimeSince";
import { Project } from "src/models/project";

interface Props {
  project: Project;
}

const ProjectListItem: React.FC<Props> = ({ project }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // TODO: Implement opening
    }
  };

  const handleOpenInExplorerClick = () => {
    window.fs.openPathInExplorer(project.folder);
  };

  return (
    <div className="container project-item" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="project-info">
        <h3>{project.name}</h3>
        <span>Last updated {getTimeSince(project.lastUpdated)}</span>
      </div>
      <ComponentGroup axis="horizontal">
        <Button text="Open" type="success" />
        <Tooltip content="Reveal in explorer">
          <Button square type="primary" icon={IconFolder} onClick={handleOpenInExplorerClick} />
        </Tooltip>
        <Tooltip content="Remove from project list">
          <Button square type="red" icon={IconTrash} />
        </Tooltip>
      </ComponentGroup>
    </div>
  );
};

export default ProjectListItem;
