import { useDragOver } from "@minoru/react-dnd-treeview";
import { IconFolder, IconMail, IconUser } from "@tabler/icons";
import clsx from "clsx";
import React from "react";
import Repeater from "src/components/ui/utils/Repeater";
import useContextMenu from "src/hooks/useContextMenu";
import { InteractionNode } from "src/models/interaction-list";
import { IModalStore, ModalName, ModalStore } from "src/stores/ModalStore";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";

const ModalActions = (state: IModalStore) => state.actions;
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
  const { setCurrentModal } = ModalStore(ModalActions);
  const { deleteInteraction } = InteractionStore(InteractionActions);

  const handleContextMenu = useContextMenu([
    {
      name: "Rename",
      action: () => {
        if (!node.data) return;

        setCurrentModal(ModalName.RENAME_INTERACTION, {
          id: node.id.toString(),
          name: node.text,
          parent: node.parent.toString(),
          type: node.data.type,
        });
      },
    },
    {
      name: "Delete",
      action: () => {
        setCurrentModal(ModalName.CONFIRMATION, {
          title: "Delete interaction?",
          text: "Do you want to delete this interaction?",
          buttonText: "Delete",
          confirmationOption: "confirmInteractionDeletion",
          handleConfirm: () => {
            deleteInteraction(node.id.toString());
          },
        });
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
