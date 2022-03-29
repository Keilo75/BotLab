import { useDragOver } from "@minoru/react-dnd-treeview";
import clsx from "clsx";
import React from "react";
import Repeater from "src/components/ui/utils/Repeater";
import { InteractionNode } from "src/models/interaction-list";
import InteractionTypeIcon from "./InteractionTypeIcon";

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
      data-id={node.id}
    >
      <Repeater times={depth}>
        <span className="border" />
      </Repeater>
      {node.data?.type && <InteractionTypeIcon type={node.data.type} />}

      {node.data?.type === "command" && "/"}
      {node.text}
    </div>
  );
};

export default InteractionListNode;
