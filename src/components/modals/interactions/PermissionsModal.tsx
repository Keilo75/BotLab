import React, { useState } from "react";
import { formList, useForm } from "@mantine/form";
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Checkbox,
  Group,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { AlertCircle, Trash } from "tabler-icons-react";
import { InteractionPermission } from "src/models/interactions";
import { v4 as uuid } from "uuid";
import { validateSnowflake } from "src/lib/validater";

interface Props {
  close: () => void;
  permissions: InteractionPermission;
  handlePermissionsChange: (permissions: InteractionPermission) => void;
}

const PermissionsModalComponent: React.FC<Props> = ({
  close,
  permissions,
  handlePermissionsChange,
}) => {
  const [invalidIDs, setInvalidIDs] = useState<string[]>([]);

  const form = useForm({
    initialValues: {
      disabledByDefault: permissions.disabledByDefault,
      exceptions: formList(permissions.exceptions),
    },
  });

  const addException = () => {
    form.addListItem("exceptions", { type: "user", identifier: "", id: uuid() });
  };

  const exceptions = form.values.exceptions.map((_, index) => {
    const removeException = () => form.removeListItem("exceptions", index);

    return (
      <Group
        key={_.id}
        direction="row"
        align="flex-start"
        spacing="xs"
        pr={form.values.exceptions.length > 4 ? "xs" : 0}
      >
        <Select
          data={[
            { label: "User", value: "user" },
            { label: "Role", value: "role" },
          ]}
          sx={{ flex: 1 }}
          {...form.getListInputProps("exceptions", index, "type")}
        />
        <TextInput
          placeholder="ID"
          {...form.getListInputProps("exceptions", index, "identifier")}
          error={invalidIDs.includes(_.id)}
        />
        <ActionIcon color="red" variant="hover" onClick={removeException} mt={3}>
          <Trash size={16} />
        </ActionIcon>
      </Group>
    );
  });

  const handleSubmit = (newPermissions: InteractionPermission) => {
    const invalidIDs = newPermissions.exceptions
      .filter((exception) => validateSnowflake(exception.identifier) !== undefined)
      .map((exception) => exception.id);
    setInvalidIDs(invalidIDs);

    if (invalidIDs.length > 0) return;

    handlePermissionsChange(newPermissions);
    close();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Title order={5}>Disabled by default</Title>
      <Text size="sm">This will disable your command for everyone, including yourself.</Text>
      <Checkbox
        {...form.getInputProps("disabledByDefault", { type: "checkbox" })}
        label="Disabled by default"
      />
      <Title order={5} mt="md">
        Exceptions
      </Title>
      {invalidIDs.length > 0 && (
        <Alert icon={<AlertCircle />} color="red" mb="xs">
          Some IDs are not valid snowflakes.
        </Alert>
      )}
      <Card>
        <ScrollArea sx={{ height: "200px" }} type="auto">
          <Group direction="column" grow noWrap spacing="xs">
            {exceptions.length > 0 ? exceptions : <Text>No exceptions.</Text>}
          </Group>
        </ScrollArea>
      </Card>
      <Group position="center" mt="md" spacing="xs">
        <Button onClick={addException}>Add Exception</Button>
      </Group>
      <Group position="right" mt="md">
        <Button type="submit">Edit</Button>
      </Group>
    </form>
  );
};

export default PermissionsModalComponent;