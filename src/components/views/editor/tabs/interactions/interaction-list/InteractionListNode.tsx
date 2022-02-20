import { useDragOver } from "@minoru/react-dnd-treeview";
import { IconFolder, IconMail, IconUser } from "@tabler/icons";
import clsx from "clsx";
import React from "react";
import Repeater from "src/components/ui/utils/Repeater";
import { InteractionNode } from "src/models/interaction-list";

interface Props {
  node: InteractionNode;
  depth: number;
  isOpen: boolean;
  onToggle: (id: string | number) => void;
}
const InteractionListNode: React.FC<Props> = ({ node, depth, isOpen, onToggle }) => {
  const handleToggle = (e: React.MouseEvent) => {
    if (!node.data) return;

    e.stopPropagation();
    onToggle(node.id);
  };

  const dragOverProps = useDragOver(node.id, isOpen, onToggle);

  return (
    <div className={clsx("interaction-node")} {...dragOverProps} onClick={handleToggle}>
      <Repeater times={depth}>
        <span className="border" />
      </Repeater>
      {node.data?.type === "folder" && <IconFolder />}
      {node.data?.type === "command" && "/"}
      {node.data?.type === "message-context-menu" && <IconMail />}
      {node.data?.type === "user-context-menu" && <IconUser />}
      {node.text}
    </div>
  );
};

export default InteractionListNode;
