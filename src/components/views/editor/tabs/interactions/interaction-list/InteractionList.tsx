import { Tree, TreeMethods } from "@minoru/react-dnd-treeview";
import { IconFolder, IconSquareMinus } from "@tabler/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "src/components/ui/inputs/Button";
import DropdownButton from "src/components/ui/inputs/DropdownButton";
import Label from "src/components/ui/Label";
import ComponentGroup from "src/components/ui/utils/ComponentGroup";
import {
  convertInteractionsToNodeModelArray,
  getDepth,
  InteractionNode,
} from "src/models/interaction-list";
import { InteractionType, InteractionTypes } from "src/models/project";
import { InteractionStore } from "src/stores/project-stores/InteractionStore";
import InteractionListNode from "./InteractionListNode";

const InteractionList: React.FC = () => {
  const [interactions, addInteraction] = InteractionStore(
    useCallback((state) => [state.interactions, state.addInteraction], [])
  );

  if (!interactions) return null;

  const treeRef = useRef<TreeMethods>(null);
  const [treeData, setTreeData] = useState<InteractionNode[]>();

  useEffect(() => {
    setTreeData(convertInteractionsToNodeModelArray(interactions));
  }, [interactions]);

  const handleAddInteraction = (option: string) => {
    const type = Object.keys(InteractionTypes).find(
      (key) => InteractionTypes[key as InteractionType] === option
    ) as InteractionType;

    addInteraction(type);
  };

  const handleDrop = (newTree: InteractionNode[]) => {
    setTreeData(newTree);
  };

  const collapseAll = () => {
    treeRef.current?.closeAll();
  };

  if (!treeData) return null;

  return (
    <>
      <div className="sidebar-head">
        <Label text="Interactions" />
        <ComponentGroup axis="horizontal">
          <DropdownButton
            text="Add Interaction"
            options={Object.values(InteractionTypes)}
            onClick={handleAddInteraction}
            className="add-button"
            disabled
          />
          <Button type="transparent" icon={IconSquareMinus} square onClick={collapseAll} />
        </ComponentGroup>
      </div>
      <hr />
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
          <InteractionListNode node={node} depth={depth} isOpen={isOpen} onToggle={onToggle} />
        )}
        canDrop={(tree, { dropTargetId, dropTarget, dragSource }) => {
          const depth = getDepth(tree, dropTargetId);

          // Allow maximum depth of 2
          if (depth > 2) return false;

          if (dragSource?.parent === dropTargetId) return true;
        }}
        dropTargetOffset={10}
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
        insertDroppableFirst={false}
      />
    </>
  );
};

export default InteractionList;
