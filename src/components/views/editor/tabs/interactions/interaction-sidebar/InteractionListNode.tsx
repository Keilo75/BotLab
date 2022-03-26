import { useDragOver } from "@minoru/react-dnd-treeview";
import clsx from "clsx";
import React from "react";
import Repeater from "src/components/ui/utils/Repeater";
import useContextMenu from "src/hooks/useContextMenu";
import { InteractionNode } from "src/models/interaction-list";
import { Box, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";
import { getOption } from "src/stores/OptionsStore";
import InteractionTypeIcon from "./InteractionTypeIcon";

const InteractionActions = (state: IInteractionStore) => state.actions;

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
  const { deleteInteraction } = InteractionStore(InteractionActions);
  const modals = useModals();

  const handleContextMenu = useContextMenu([
    {
      name: "Rename",
      action: () => {
        modals.openContextModal("rename-interaction", {
          innerProps: { name: node.text, type: node.data?.type, id: node.id },
          centered: true,
          title: "Rename interaction",
        });
      },
    },
    {
      name: "Delete",
      action: () => {
        if (getOption("editor.confirmInteractionDeletion"))
          modals.openConfirmModal({
            title: "Delete interaction?",
            centered: true,
            children: <Text size="sm">Do you want to delete this interaction?</Text>,
            labels: { confirm: "Delete", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: handleDelete,
          });
        else handleDelete();
      },
    },
  ]);

  const handleDelete = () => {
    deleteInteraction(node.id.toString());
  };

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
      {node.data?.type && <InteractionTypeIcon type={node.data.type} />}
      <Text>
        {node.data?.type === "command" && "/"}
        {node.text}
      </Text>
    </Box>
  );
};

export default InteractionListNode;
