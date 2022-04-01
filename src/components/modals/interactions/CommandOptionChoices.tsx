import { ActionIcon, Card, Group, ScrollArea, Stack, TextInput } from "@mantine/core";
import React from "react";
import { CommandOptionChoice } from "src/models/interactions";
import { Trash } from "tabler-icons-react";

interface CommandOptionChoicesProps {
  choices: CommandOptionChoice[];
  handleChoicesChange: (choices: CommandOptionChoice[]) => void;
}

const CommandOptionChoices: React.FC<CommandOptionChoicesProps> = ({
  choices,
  handleChoicesChange,
}) => {
  const getID = (elem: HTMLElement) => {
    const choiceItem = elem.closest(".choice-item");
    const id = choiceItem?.getAttribute("data-id");
    return id;
  };

  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    const id = getID(e.currentTarget);
    handleChoicesChange(choices.filter((choice) => choice.id !== id));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = getID(e.currentTarget);
    handleChoicesChange(
      choices.map((choice) =>
        choice.id === id ? { ...choice, [e.currentTarget.name]: e.currentTarget.value } : choice
      )
    );
  };

  return (
    <Card className="choice-list" p={0}>
      <ScrollArea sx={{ height: "100%" }}>
        <Stack spacing="xs" p="md" pr={choices.length > 4 ? "lg" : "md"}>
          {choices.map((choice) => (
            <Group
              key={choice.id}
              direction="row"
              spacing="xs"
              data-id={choice.id}
              className="choice-item"
            >
              <TextInput
                placeholder="Name"
                className="choice-input"
                value={choice.name}
                name="name"
                onChange={handleTextChange}
              />
              <TextInput
                placeholder="Value"
                className="choice-input"
                name="value"
                value={choice.value}
                onChange={handleTextChange}
              />
              <ActionIcon color="red" variant="hover" mt={3} onClick={handleDelete}>
                <Trash size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      </ScrollArea>
    </Card>
  );
};

export default CommandOptionChoices;
