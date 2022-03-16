import { useDragOver } from "@minoru/react-dnd-treeview";
import clsx from "clsx";
import React from "react";
import Repeater from "src/components/ui/utils/Repeater";
import useContextMenu from "src/hooks/useContextMenu";
import { InteractionNode } from "src/models/interaction-list";
import { Box, Text } from "@mantine/core";
import { Folder, Mail, User } from "tabler-icons-react";

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
    {
      name: "Rename",
      action: () => {
        console.log("hi");
      },
    },
    {
      name: "Delete",
      action: () => {
        console.log("hi");
      },
    },
  ]);

  const handleToggle = (e: React.MouseEvent) => {
    if (!node.data) return;

    e.stopPropagation();
    onToggle(node.id);

    selectInteraction(`${node.id}`);
  };

  const dragOverProps = useDragOver(node.id, isOpen, onToggle);

  return (
    <Box
      sx={(theme) => ({ borderLeftColor: isSelected ? theme.colors.blue[8] : "transparent" })}
      className={clsx("interaction-node", isSelected && "selected-node")}
      {...dragOverProps}
      onClick={handleToggle}
      onContextMenu={handleContextMenu}
    >
      <Repeater times={depth}>
        <span className="border" />
      </Repeater>
      {node.data?.type === "folder" && <Folder />}
      {node.data?.type === "message-context-menu" && <Mail />}
      {node.data?.type === "user-context-menu" && <User />}
      <Text>
        {node.data?.type === "command" && "/"}
        {node.text}
      </Text>
    </Box>
  );
};

export default InteractionListNode;
