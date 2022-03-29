import { Button, Card, Divider, Group, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import SelectableList from "src/components/ui/selectable-list/SelectableList";
import { InteractionOption } from "src/models/interactions";
import { IContextMenuStore, ContextMenuStore, ContextMenu } from "src/stores/ContextMenuStore";
import { Plus } from "tabler-icons-react";
import { v4 as uuid } from "uuid";

const SetContextMenu = (state: IContextMenuStore) => state.setContextMenu;

interface Props {
  close: () => void;
  options: InteractionOption[];
  handleOptionsChange: (options: InteractionOption[]) => void;
}

const InteractionOptionsModalComponent: React.FC<Props> = ({ options: originalOptions }) => {
  const [options, setOptions] = useState(originalOptions);
  const [selectedOption, setSelectedOption] = useState<string>();

  const setContextMenu = ContextMenuStore(SetContextMenu);

  useEffect(() => {
    if (options.length > 0 && selectedOption === undefined) {
      setSelectedOption(options[options.length - 1].id);
    }
  }, [options]);

  const handleAddOption = () => {
    const id = uuid();

    setOptions((prev) => [
      ...prev,
      {
        id,
        name: "New Option",
        description: "",
        type: "string",
        required: true,
        choices: [],
      },
    ]);

    setSelectedOption(id);
  };

  const handleDeleteOption = (id: string) => {
    setOptions((prev) => prev.filter((option) => option.id !== id));
    if (selectedOption === id) setSelectedOption(undefined);
  };

  const handleListContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const targetID = target.getAttribute("data-id");
    const items: ContextMenu["items"] = [];

    if (targetID) {
      const handleDelete = () => handleDeleteOption(targetID);
      const handleClone = () => {
        const index = options.findIndex((option) => option.id === targetID);
        const clone = structuredClone(options[index]);
        clone.id = uuid();

        setOptions((prev) => [...prev.slice(0, index + 1), clone, ...prev.slice(index + 1)]);
        setSelectedOption(clone.id);
      };

      items.push(
        {
          name: "Delete",
          action: handleDelete,
        },
        {
          name: "Clone",
          action: handleClone,
        }
      );
    } else {
      items.push({ name: "New Option", action: handleAddOption });
    }

    setContextMenu({ x: e.clientX, y: e.clientY, items, width: 200 });
  };

  return (
    <form>
      <Group className="options-content">
        <Stack className="options-sidebar" spacing={0}>
          <Button
            onClick={handleAddOption}
            leftIcon={<Plus size={16} />}
            disabled={options.length > 24}
          >
            Add Option
          </Button>
          <Divider my="xs" />
          <Card className="options-list" p={0} onContextMenu={handleListContextMenu}>
            <SelectableList
              items={options}
              setItems={setOptions}
              selected={selectedOption}
              setSelected={setSelectedOption}
            />
          </Card>
          <Text color="dimmed">{options.length} / 25 Options</Text>
        </Stack>
        <Stack className="selected-option">
          {selectedOption === undefined ? <Text>No options.</Text> : <></>}
        </Stack>
      </Group>

      <Group position="right" mt="md">
        <Button type="submit">Edit</Button>
      </Group>
    </form>
  );
};

export default InteractionOptionsModalComponent;
