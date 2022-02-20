import { useDragOver } from "@minoru/react-dnd-treeview";
import { IconFolder, IconMail, IconUser } from "@tabler/icons";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import Repeater from "src/components/ui/utils/Repeater";
import useContextMenu from "src/hooks/useContextMenu";
import { InteractionNode } from "src/models/interaction-list";

interface Props {
  node: InteractionNode;
  depth: number;
  isOpen: boolean;
  onToggle: (id: string | number) => void;
  isSelected: boolean;
  selectInteraction: (id: string) => void;
}
const InteractionListNode: React.FC<Props> = ({
  node,
  depth,
  isOpen,
  onToggle,
  isSelected,
  selectInteraction,
}) => {
  const handleContextMenu = useContextMenu([
    { name: "Rename", action: () => console.log(true) },
    { name: "Delete", action: () => console.log("hi") },
  ]);

  const handleToggle = (e: React.MouseEvent) => {
    if (!node.data) return;

    e.stopPropagation();
    onToggle(node.id);

    selectInteraction(`${node.id}`);
  };

  const dragOverProps = useDragOver(node.id, isOpen, onToggle);

  return (
    <div
      className={clsx("interaction-node", isSelected && "selected-node")}
      {...dragOverProps}
      onClick={handleToggle}
      onContextMenu={handleContextMenu}
    >
      <Repeater times={depth}>
        <span className="border" />
      </Repeater>
      {node.data?.type === "folder" && <IconFolder />}
      {node.data?.type === "command" && "/"}
      {node.data?.type === "message-context-menu" && <IconMail />}
      {node.data?.type === "user-context-menu" && <IconUser />}
      <span className="node-text">{node.text}</span>
    </div>
  );
};

export default InteractionListNode;
