# Keyboard List

The keyboard list is a reusable component to ensure consistent keyboard navigation when using lists.

It currently supports the following key combinations:

- Arrow Down: Focus the next element
- Arrow Up: Focus the previous element
- Pos 1: Focus the first element
- End: Focus the last element
- Space / Enter: Select the focused element

If the list is blurred without selecting a new element, the currently selected element will become the new focused element.

## Usage

To create a keyboard list, use the `KeyboardList` component.

```jsx
<KeyboardList
  selectedIndex={selectedIndex}
  length={children.length}
  render={(refs) =>
    children.map((tab, index) => (
      <button
        key={tab.props.name}
        data-button-index={index}
        ref={(ref) => (refs[index].current = ref)}
        onClick={selectTab}
      >
        {tab.props.name}
      </button>
    ))
  }
></KeyboardList>
```

The component uses the following props:

- selectedIndex: the current selected index, which will be the only keyboard-navigatable element
- length: the length of the list to render
- render: This uses render props and returns a function with an array of refs. The return value should be an array of elements, each of which should be assigned a unique ref from the array.

### Important Considerations:

Please note that you cannot assign the ref directly.

```jsx
// Bad, not going to work
<button ref={refs[index].current} />
// Good
<button ref={(ref) => (refs[index.current] = ref)} />
```

Furthermore, your render children should have an onClick method which updates the selectedIndex prop.

```js
const selectTab = (e: React.MouseEvent<HTMLElement>) => {
  const index = e.currentTarget.getAttribute("data-button-index");

  if (index) {
    setSelected(parseInt(index));
  }
};
```
