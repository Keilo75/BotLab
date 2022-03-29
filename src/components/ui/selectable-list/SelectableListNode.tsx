import { NodeModel, useDragOver } from "@minoru/react-dnd-treeview";
import clsx from "clsx";
import React from "react";

interface SelectableListNodeProps {
  node: NodeModel;
  selected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SelectableListNode: React.FC<SelectableListNodeProps> = ({ node, selected, setSelected }) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(node.id.toString());
  };

  const dragOverProps = useDragOver(node.id, true, () => {});

  return (
    <div
      className={clsx("selectable-list-node", selected && "selected-node")}
      onClick={handleToggle}
      data-id={node.id}
      {...dragOverProps}
    >
      {node.text}
    </div>
  );
};

export default SelectableListNode;
