# Inputs

This is a list of all inputs and how to use them.

## Button

```jsx
<Button text="Click me!" type="primary" />
```

| Prop          | Type                                             | Optional | Description                           |
| ------------- | ------------------------------------------------ | -------- | ------------------------------------- |
| type          | "primary" \| "transparent" \| "success" \| "red" | no       | The type of the button                |
| text          | string                                           | yes      | The label of the button               |
| textAlignment | "center" \| "left" \| "right"                    | yes      | The alignment of the label            |
| onClick       | React.MouseEventHandler<HTMLButtonElement>       | no       | The click event handler               |
| icon          | TablerIcon                                       | yes      | The icon of the button                |
| submit        | boolean                                          | yes      | Wheter this button is a submit button |
| disabled      | boolean                                          | yes      | Wheter this button is disabled        |
| square        | boolean                                          | yes      | Wheter this button is square          |

## TextInput

```jsx
const [value, setValue] = useState("");
return <TextInput name="text-input" value={value} onChange={(value) => setValue(value)} />;
```

| Prop      | Type                                | Optional | Description                      |
| --------- | ----------------------------------- | -------- | -------------------------------- |
| name      | string                              | no       | The name of the text input       |
| value     | string                              | no       | The value of the text input      |
| onChange  | (text: string, name?: string): void | no       | The change event handler         |
| className | string                              | yes      | Additional class names           |
| error     | boolean                             | yes      | Wheter the input contains errors |

## RadioButton

```jsx
const [selected, setSelected] = useState(0);
return (
  <RadioButton
    name="radio-button"
    selectedIndex={value}
    onChange={(index) => setSelected(index)}
    options={["First", "Second", "Third"]}
  />
);
```

| Prop          | Type                                 | Optional | Description                            |
| ------------- | ------------------------------------ | -------- | -------------------------------------- |
| name          | string                               | no       | The name of the radio button           |
| selectedIndex | string                               | no       | The selected index of the radio button |
| onChange      | (index: number, name?: string): void | no       | The change event handler               |
| options       | string[]                             | no       | The available options                  |
| axis          | "horizontal" \| "vertical"           | yes      | Defaults to `vertical`                 |

## Toggle Switch

```jsx
const [checked, setChecked] = useState(false);
return (
  <ToggleSwitch
    name="toggle-switch"
    checked={checked}
    label="Click me!"
    onChange={(checked) => setChecked(checked)}
  />
);
```

| Prop     | Type                                    | Optional | Description                    |
| -------- | --------------------------------------- | -------- | ------------------------------ |
| name     | string                                  | no       | The name of the toggle switch  |
| label    | string                                  | no       | The label of the toggle switch |
| checked  | boolean                                 | no       | Wheter the switch is checked   |
| onChange | (checked: boolean, name?: string): void | no       | The change event handler       |

## Dropdown Button

```jsx
const handleDropdownClick = (type: string) => {
  console.log(type);
};

return (
  <DropdownButton
    text="Add Interaction"
    options={["Command", "Command Group"]}
    onClick={handleDropdownClick}
  />
);
```

| Prop      | Type                   | Optional | Description             |
| --------- | ---------------------- | -------- | ----------------------- |
| text      | string                 | no       | The label of the button |
| optioms   | string[]               | no       | The available options   |
| onClick   | (type: string) => void | no       | The click event handler |
| className | string                 | yes      | Additional class names  |
