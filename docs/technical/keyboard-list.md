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
<KeyboardList selectedIndex={selected} length={children.length}>
  {(refs) =>
    children.map((tab, index) => (
      <button
        key={tab.props.name}
        data-button-index={index}
        className="button button-transparent button-text-left"
        ref={(ref) => (refs[index].current = ref)}
        onClick={selectTab}
      >
        {tab.props.name}
      </button>
    ))
  }
</KeyboardList>
```

The component uses the following props:

- selectedIndex: the current selected index, which will be the only keyboard-navigatable element
- length: the length of the list to render

It expects a function as a child, which gives you an array of refs. Assign each child one ref.

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
