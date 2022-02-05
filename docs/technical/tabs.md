# Tabs

## Usage

To create tabs, use the `Tabs` component:

```jsx
<Tabs name="Tabs">
  <Tab name="First Tab">...</Tab>
  <Tab name="Second Tab">...</Tab>
  <Tab name="Third Tab">...</Tab>
</Tabs>
```

## Props

| Prop     | Type                       | Optional | Description                                                                          |
| -------- | -------------------------- | -------- | ------------------------------------------------------------------------------------ |
| name     | string                     | no       | The name of the tabs                                                                 |
| axis     | "horizontal" \| "vertical" | yes      | Wheter the tabs should be aligned horizontally or vertically. Defaults to `vertical` |
| children | Tab[]                      | no       | All tabs                                                                             |

## Important considerations

When axis is set to horizontal, the name of the tabs will not be shown.
