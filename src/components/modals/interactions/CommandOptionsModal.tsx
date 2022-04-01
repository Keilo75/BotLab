import {
  Button,
  Card,
  Divider,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import SelectableList from "src/components/ui/selectable-list/SelectableList";
import {
  CommandOptionType,
  CommandOptionTypes,
  CommandOption,
  hasTypeChoices,
  CommandOptionChoice,
} from "src/models/interactions";
import { IContextMenuStore, ContextMenuStore, ContextMenu } from "src/stores/ContextMenuStore";
import { Plus } from "tabler-icons-react";
import { v4 as uuid } from "uuid";
import CommandOptionChoices from "./CommandOptionChoices";

const SetContextMenu = (state: IContextMenuStore) => state.setContextMenu;

const optionTypes = Object.keys(CommandOptionTypes) as CommandOptionType[];

interface Props {
  close: () => void;
  options: CommandOption[];
  handleOptionsChange: (options: CommandOption[]) => void;
}

const CommandOptionsModalComponent: React.FC<Props> = ({
  options: originalOptions,
  handleOptionsChange,
  close,
}) => {
  const [options, setOptions] = useState(originalOptions);
  const [selectedOptionID, setSelectedOptionID] = useState<string>();

  const setContextMenu = ContextMenuStore(SetContextMenu);

  useEffect(() => {
    if (options.length > 0 && selectedOptionID === undefined) {
      setSelectedOptionID(options[options.length - 1].id);
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
      },
    ]);

    setSelectedOptionID(id);
  };

  const handleDeleteOption = (id: string) => {
    setOptions((prev) => prev.filter((option) => option.id !== id));
    if (selectedOptionID === id) setSelectedOptionID(undefined);
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
        setSelectedOptionID(clone.id);
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

  const handleSubmit = () => {
    handleOptionsChange(options);
    close();
  };

  const selectedOption = options.find((option) => option.id === selectedOptionID);
  const doesTypeAllowChoices = hasTypeChoices(selectedOption?.type);

  const handleOptionChange = <T extends keyof CommandOption>(key: T, value: CommandOption[T]) => {
    setOptions((prev) =>
      prev.map((option) => {
        if (option.id !== selectedOptionID) return option;

        const newOption = { ...option, [key]: value };
        if (key === "type") newOption.choices = undefined;

        return newOption;
      })
    );
  };

  const handleTypeChange = (value: CommandOptionType) => handleOptionChange("type", value);
  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleOptionChange("required", e.target.checked);
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleOptionChange(e.target.name as keyof CommandOption, e.target.value);
  const handleChoicesToggle = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleOptionChange("choices", e.target.checked ? [] : undefined);
  const handleChoicesChange = (choices: CommandOptionChoice[]) =>
    handleOptionChange("choices", choices);

  const handleAddChoice = () => {
    if (!selectedOption?.choices) return;
    handleChoicesChange([...selectedOption.choices, { name: "", value: "", id: uuid() }]);
  };

  return (
    <>
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
              selected={selectedOptionID}
              setSelected={setSelectedOptionID}
              width={180}
            />
          </Card>
          <Text color="dimmed">{options.length} / 25 Options</Text>
        </Stack>
        <Stack className="selected-option">
          {selectedOption === undefined ? (
            <Text>No options.</Text>
          ) : (
            <>
              <Group align="flex-end">
                <Select
                  label="Type"
                  data={optionTypes.map((type) => ({
                    label: CommandOptionTypes[type],
                    value: type,
                  }))}
                  value={selectedOption.type}
                  onChange={handleTypeChange}
                  className="option-type"
                />
                <Switch
                  label="Required Option"
                  checked={selectedOption.required}
                  onChange={handleRequiredChange}
                  className="option-required"
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Name"
                  name="name"
                  required
                  value={selectedOption.name}
                  onChange={handleTextChange}
                />
                <TextInput
                  label="Description"
                  name="description"
                  required
                  value={selectedOption.description}
                  onChange={handleTextChange}
                />
              </Group>

              <Stack className="option-choices" spacing={0}>
                <Text size="sm" weight={500}>
                  Choices
                </Text>
                {doesTypeAllowChoices ? (
                  <>
                    <Group position="apart" mb="xs">
                      <Switch
                        label="Enable Choices"
                        checked={selectedOption.choices !== undefined}
                        onChange={handleChoicesToggle}
                      />
                      <Button
                        leftIcon={<Plus size={16} />}
                        disabled={
                          selectedOption.choices === undefined || selectedOption.choices.length > 24
                        }
                        onClick={handleAddChoice}
                      >
                        Add Choice
                      </Button>
                    </Group>
                    {selectedOption.choices !== undefined && (
                      <>
                        <CommandOptionChoices
                          choices={selectedOption.choices}
                          handleChoicesChange={handleChoicesChange}
                        />
                        <Text color="dimmed">{selectedOption.choices.length} / 25 Choices</Text>
                      </>
                    )}
                  </>
                ) : (
                  <Text>This option type does not allow choices.</Text>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Group>

      <Group position="right" mt="md">
        <Button onClick={handleSubmit}>Edit</Button>
      </Group>
    </>
  );
};

export default CommandOptionsModalComponent;
