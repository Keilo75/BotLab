import { Options } from "src/stores/OptionsStore";
import { InteractionType } from "./interactions";

export enum ModalName {
  OPTIONS = "options",
  CREATE_NEW_PROJECT = "create-new-project",
  ERROR = "error",
  ABOUT = "about",
  CONFIRMATION = "confirmation",
  RENAME_INTERACTION = "rename-interaction",
  EDIT_PERMISSIONS = "edit-permissions",
}

export interface ModalData extends Record<ModalName, any> {
  error: string;
  confirmation: {
    title: string;
    text: string;
    buttonText: string;
    confirmationOption: keyof Options["editor"];
    handleConfirm: () => void;
  };
  "rename-interaction": {
    id: string;
    name: string;
    type: InteractionType;
    parent: string;
  };
}
