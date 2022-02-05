# Input Group

The input group is a reusable component which allows you to easily create a list of inputs.

## Usage

To create a input group, use the `InputGroup` component:

```jsx
<InputGroup state={inputState} onChange={setInputState}>
  {(state, setState) => (
    <>
      <RadioButton
        name="radioButton"
        selectedIndex={state.radioButton}
        onChange={setState}
        options={["Example 1", "Example 2"]}
      />
    </>
  )}
</InputGroup>
```

## Props

| Prop     | Type                                                                           | Optional | Description                         |
| -------- | ------------------------------------------------------------------------------ | -------- | ----------------------------------- |
| state    | T                                                                              | no       | The state of the input group        |
| onChange | (value: T): void                                                               | no       | A function which updates the state  |
| children | (state: T, setState: (value: any, name: string) => void) => React.ReactElement | no       | The function to render all elements |

## Important Considerations

Each component should have a `name` prop which directly corresponds to a key in the state.
