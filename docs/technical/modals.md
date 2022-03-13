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

| Key             | Type                                  | Description            |
| --------------- | ------------------------------------- | ---------------------- |
| setCurrentModal | (name: ModalName, data?: any) => void | Show a modal           |
| hideModal       | () => void                            | Hide the current modal |

In order to retrieve the current modal's data, use the `useModalData` hook.

```js
import { useModalData, ModalName } from "src/stores/ModalStore";
const error = useModalData<ModalName.Error>();
```

## Modal Props

| Prop    | Type      | Optional | Description                                                     |
| ------- | --------- | -------- | --------------------------------------------------------------- |
| name    | ModalName | no       | The name of the modal                                           |
| large   | boolean   | yes      | Wheter the modal is large. Defaults to `false`                  |
| default | boolean   | yes      | Wheter the modal should open by default. Useful for developing. |
