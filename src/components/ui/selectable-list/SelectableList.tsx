import { ScrollArea } from "@mantine/core";
import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import React, { useMemo } from "react";
import SelectableListNode from "./SelectableListNode";

interface SelectableListProps<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  selected: string | undefined;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  width: React.CSSProperties["width"];
}

const SelectableList = <T extends { id: string; name: string }>({
  items,
  setItems,
  selected,
  setSelected,
  width,
}: SelectableListProps<T>) => {
  const treeData = useMemo<NodeModel[]>(
    () => items.map((item) => ({ id: item.id, text: item.name, parent: 0 })),
    [items]
  );

  const handleDrop = (newTree: NodeModel[]) => {
    const newItems: T[] = newTree.map((node) => items.find((item) => item.id === node.id)!);
    setItems(newItems);
  };

  return (
    <ScrollArea sx={{ height: "100%" }}>
      <Tree
        tree={treeData}
        rootId={0}
        onDrop={handleDrop}
        sort={false}
        classes={{
          container: "selectable-list",
          placeholder: "selectable-list-placeholder",
          draggingSource: "selectable-dragging-node",
        }}
        render={(node) => (
          <SelectableListNode
            node={node}
            selected={node.id === selected}
            setSelected={setSelected}
            width={width}
          />
        )}
        canDrop={(tree, { dragSource, dropTargetId }) => {
          if (dragSource?.parent === dropTargetId) return true;
        }}
        placeholderRender={() => <div className="placeholder" />}
      />
    </ScrollArea>
  );
};

export default SelectableList;
