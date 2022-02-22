# Modals

Modals are a reusable component to render popups as well as error messages.
Please note that modals inside modals are currently not supported.

## Usage

To create a new modal, use the `Modal` component:

```jsx
<Modal name={ModalName.MODAL_NAME}>
  <ModalLayout.Content padding>
    <h2>I'm a modal</h2>
  </ModalLayout.Content>
  <ModalLayout.Footer>
    <Button text="Close" type="primary" onClick={hideModal} />
  </ModalLayout.Footer>
</Modal>
```

It is recommended to use the `ModalContent` and `ModalFooter` components inside the modal root, as they ensure a consistent styling.

## Modal Store

By using the modal store, you can easily manage modals.

```js
import { ModalStore } from "src/stores/ModalStore";
const store = ModalStore();
```

| Key             | Type                                  | Description                                               |
| --------------- | ------------------------------------- | --------------------------------------------------------- |
| data            | any                                   | Modal data which is passed to the modal on initialization |
| setCurrentModal | (name: ModalName, data?: any) => void | Show a modal                                              |
| hideModal       | () => void                            | Hide the current modal                                    |

## Modal Props

| Prop  | Type      | Optional | Description                                    |
| ----- | --------- | -------- | ---------------------------------------------- |
| name  | ModalName | no       | The name of modal                              |
| large | boolean   | yes      | Wheter the modal is large. Defaults to `false` |
