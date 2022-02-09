# Modals

Modals are a reusable component to render popups as well as error messages.
Please note that modals inside modals are currently not supported.

## Usage

To create a new modal, use the `useModal` hook:

```jsx
const Modal = useModal();
Modal.show();
Modal.hide();

return <Modal.Component>...</Modal.Component>;
```

It is recommended to use the `ModalContent` and `ModalFooter` components inside the modal root, as they ensure a consistent styling.

```jsx
import useModal, { ModalLayout } from "hooks/useModal";

const ConfirmModal = useModal({ name: "confirm-modal" });

return (
  <>
    <ConfirmModal.Component>
      <ModalLayout.Content>...</ModalLayout.Content>
      <ModalLayout.Footer>...</ModalLayout.Footer>
    </ConfirmModal.Component>
  </>
);
```

Alternatively, you can use `modalStore.setCurrentModal(name: ModalName): void` to open a modal.

## Special Modals

**Error Modal**

```js
modalStore.openErrorModal("error text");
```

## useModal API

The `useModal` hook takes in an object of options, which are described here:
| Option | Type | Optional | Description
| --- | --- | --- |--- |
| name |ModalName | no | The name of the modal
| large |boolean | yes | Wheter the modal should be full-screen
