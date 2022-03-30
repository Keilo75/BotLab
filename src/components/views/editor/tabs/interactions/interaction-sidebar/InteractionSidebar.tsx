import { ActionIcon, Box, Button, Divider, Group, Menu, ScrollArea, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Tree, TreeMethods } from "@minoru/react-dnd-treeview";
import React, { useEffect, useRef, useState } from "react";
import {
  convertInteractionsToNodeModelArray,
  getDepth,
  getParents,
  getParentsFromNodeModel,
  InteractionNode,
} from "src/models/interaction-list";
import { InteractionType, InteractionTypes, isTextBased } from "src/models/interactions";
import { ContextMenu, ContextMenuStore, IContextMenuStore } from "src/stores/ContextMenuStore";
import { getOption } from "src/stores/OptionsStore";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";
import { ChevronDown, Folder, Plus } from "tabler-icons-react";
import InteractionListNode from "./InteractionListNode";
import InteractionTypeIcon from "./InteractionTypeIcon";

const Interactions = (state: IInteractionStore) => state.interactions;
const SelectedInteractionID = (state: IInteractionStore) => state.selectedInteractionID;
const InteractionActions = (state: IInteractionStore) => state.actions;
const SetContextMenu = (state: IContextMenuStore) => state.setContextMenu;

const InteractionSidebar: React.FC = () => {
  const interactions = InteractionStore(Interactions);
  const selectedInteractionID = InteractionStore(SelectedInteractionID);
  const { addInteraction, updateParents, selectInteraction, deleteInteraction, cloneInteraction } =
    InteractionStore(InteractionActions);
  const setContextMenu = ContextMenuStore(SetContextMenu);
  const modals = useModals();

  if (!interactions) return null;

  const treeRef = useRef<TreeMethods>(null);
  const [treeData, setTreeData] = useState<InteractionNode[]>();

  useEffect(() => {
    const newTree = convertInteractionsToNodeModelArray(interactions);
    setTreeData(newTree);

    if (!selectedInteractionID) {
      // Select first root item
      const selected = interactions.find((i) => i.parent === "0");

      if (selected) selectInteraction(selected.id);
    }
  }, [interactions]);

  const handleNewInteraction = (e: React.MouseEvent) => {
    const type = e.currentTarget.getAttribute("data-type") as InteractionType;
    addInteraction(type);
  };

  const handleDrop = (newTree: InteractionNode[]) => {
    const newParents = getParentsFromNodeModel(newTree);
    updateParents(
      newParents,
      newTree.map((item) => item.id.toString())
    );
  };

  const handleInteractionTreeContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const interactionNode = target.closest(".interaction-node");
    const targetID = interactionNode?.getAttribute("data-id");

    const items: ContextMenu["items"] = [];

    if (targetID) {
      const handleDelete = () => deleteInteraction(targetID);

      items.push(
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
        {
          name: "Clone",
          action: () => cloneInteraction(targetID),
        }
      );
    } else
      for (const type of Object.keys(InteractionTypes) as InteractionType[]) {
        items.push({ name: `New ${InteractionTypes[type]}`, action: () => addInteraction(type) });
      }

    setContextMenu({ x: e.clientX, y: e.clientY, items, width: 200 });
  };

  const [commandType, ...remainingInteractionTypes] = Object.keys(
    InteractionTypes
  ) as InteractionType[];

  return (
    <>
      <Box p="md">
        <Group spacing="xs" className="sidebar-head">
          <Button
            className="default-btn"
            data-type={commandType}
            onClick={handleNewInteraction}
            leftIcon={<Plus size={16} />}
          >
            New {InteractionTypes[commandType]}
          </Button>
          <Menu
            control={
              <ActionIcon variant="filled" size={36}>
                <ChevronDown size={16} />
              </ActionIcon>
            }
            transition="pop"
            placement="start"
            size="lg"
          >
            {remainingInteractionTypes.map((type, index) => (
              <Menu.Item
                key={index}
                data-type={type}
                onClick={handleNewInteraction}
                icon={<InteractionTypeIcon type={type} iconProps={{ size: 16 }} />}
              >
                New {InteractionTypes[type]}
              </Menu.Item>
            ))}
          </Menu>
        </Group>
      </Box>
      <Divider mb="md" />
      <ScrollArea
        className="interaction-tree-container"
        onContextMenu={handleInteractionTreeContextMenu}
      >
        <Tree
          ref={treeRef}
          tree={treeData || []}
          rootId={"0"}
          onDrop={handleDrop}
          initialOpen={getParents(interactions, selectedInteractionID || "0")}
          sort={false}
          insertDroppableFirst={false}
          classes={{
            container: "interaction-tree",
            draggingSource: "dragging-node",
            dropTarget: "drop-target",
            placeholder: "placeholder-container",
          }}
          render={(node, { depth, isOpen, onToggle }) => (
            <InteractionListNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
              isSelected={node.id === selectedInteractionID}
              selectInteraction={selectInteraction}
            />
          )}
          canDrop={(tree, { dropTargetId, dragSource }) => {
            // TODO: Optimize this
            const depth = getDepth(tree, dropTargetId);

            // Do not drag context menus into folders
            if (dragSource?.data && !isTextBased(dragSource?.data?.type) && depth > 0) return false;

            if (dragSource?.data?.type === "folder") {
              // Allow maximum depth of 1 for folders
              if (depth > 1) return false;
            }

            // Allow maximum depth of 2
            if (depth > 2) return false;

            if (dragSource?.parent === dropTargetId) return true;
          }}
          dragPreviewRender={(monitorProps) => (
            <div className="interaction-drag-preview">
              {monitorProps.item.data?.type === "folder" && <Folder />}
              {monitorProps.item.text}
            </div>
          )}
          placeholderRender={(node, { depth }) => (
            <Box className="placeholder" sx={() => ({ left: depth * 20 })} />
          )}
        />
      </ScrollArea>
    </>
  );
};

export default InteractionSidebar;
