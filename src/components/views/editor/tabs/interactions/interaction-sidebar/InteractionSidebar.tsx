import { ActionIcon, Box, Button, Divider, Group, Menu } from "@mantine/core";
import { Tree, TreeMethods } from "@minoru/react-dnd-treeview";
import { IconFolder } from "@tabler/icons";
import React, { useEffect, useRef, useState } from "react";
import {
  convertInteractionsToNodeModelArray,
  getDepth,
  getParentsFromNodeModel,
  InteractionNode,
} from "src/models/interaction-list";
import { InteractionType, InteractionTypes, isTextBased } from "src/models/interactions";
import { IInteractionStore, InteractionStore } from "src/stores/project-stores/InteractionStore";
import { ChevronDown } from "tabler-icons-react";
import InteractionListNode from "./InteractionListNode";

const Interactions = (state: IInteractionStore) => state.interactions;
const SelectedInteractionID = (state: IInteractionStore) => state.selectedInteractionID;
const InteractionActions = (state: IInteractionStore) => state.actions;

const InteractionSidebar: React.FC = () => {
  const interactions = InteractionStore(Interactions);
  const selectedInteractionID = InteractionStore(SelectedInteractionID);
  const { addInteraction, updateParents, selectInteraction } = InteractionStore(InteractionActions);

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

  const handleAddInteraction = (e: React.MouseEvent) => {
    const type = e.currentTarget.getAttribute("data-type") as InteractionType;
    addInteraction(type);
  };

  const handleDrop = (newTree: InteractionNode[]) => {
    const newParents = getParentsFromNodeModel(newTree);
    updateParents(newParents);
  };

  if (!treeData) return null;

  const [commandType, ...remainingInteractionTypes] = Object.keys(
    InteractionTypes
  ) as InteractionType[];

  return (
    <>
      <Box p="md">
        <Group spacing="xs" className="sidebar-head">
          <Button className="default-btn" data-type={commandType} onClick={handleAddInteraction}>
            Add {InteractionTypes[commandType]}
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
              <Menu.Item key={index} data-type={type} onClick={handleAddInteraction}>
                Add {InteractionTypes[type]}
              </Menu.Item>
            ))}
          </Menu>
        </Group>
      </Box>
      <Divider mb="md" />
      <Tree
        tree={treeData}
        rootId={"0"}
        onDrop={handleDrop}
        ref={treeRef}
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
          // Do not drag context menus
          if (dragSource?.data && !isTextBased(dragSource?.data?.type)) return false;

          const depth = getDepth(tree, dropTargetId);

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
            {monitorProps.item.data?.type === "folder" && <IconFolder />}
            {monitorProps.item.text}
          </div>
        )}
        placeholderRender={(node, { depth }) => (
          <div className="placeholder" style={{ left: depth * 20 }} />
        )}
        sort={false}
      />
    </>
  );
};

export default InteractionSidebar;
