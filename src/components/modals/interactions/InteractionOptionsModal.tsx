import { Button, Card, Divider, Group, Text, TextInput } from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";
import InputGroup from "src/components/ui/input-group/InputGroup";
import SelectableList from "src/components/ui/selectable-list/SelectableList";
import { InteractionOption } from "src/models/interactions";
import { Plus } from "tabler-icons-react";
import { v4 as uuid } from "uuid";

interface Props {
  close: () => void;
  options: InteractionOption[];
  handleOptionsChange: (options: InteractionOption[]) => void;
}

const InteractionOptionsModalComponent: React.FC<Props> = ({ options: originalOptions }) => {
  const [options, setOptions] = useState(originalOptions);
  const [selectedOption, setSelectedOption] = useState<string>();

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(options[options.length - 1].id);
    }
  }, [options]);

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: uuid(),
        name: "New Option",
        description: "",
        type: "string",
        required: true,
        choices: [],
      },
    ]);
  };

  const selected = useMemo(
    () => options.find((item) => item.id === selectedOption),
    [options, selectedOption]
  );

  return (
    <form>
      <Group className="options-content">
        <Group direction="column" className="options-sidebar" align="stretch" spacing={0} noWrap>
          <Button
            onClick={handleAddOption}
            leftIcon={<Plus size={16} />}
            disabled={options.length > 24}
          >
            Add Option
          </Button>
          <Divider my="xs" />
          <Card className="options-list" p={0}>
            <SelectableList
              items={options}
              setItems={setOptions}
              selected={selectedOption}
              setSelected={setSelectedOption}
            />
          </Card>
          <Text color="dimmed">{options.length} / 25 Options</Text>
        </Group>
        <Group className="selected-option" direction="column" align="stretch">
          {selected === undefined ? <Text>No options.</Text> : <></>}
        </Group>
      </Group>

      <Group position="right" mt="md">
        <Button type="submit">Edit</Button>
      </Group>
    </form>
  );
};

export default InteractionOptionsModalComponent;
