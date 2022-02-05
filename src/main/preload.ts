import { contextBridge, ipcRenderer } from "electron";
import { IPCChannels } from "src/models/ipc-channels";
import { MenuAction } from "src/models/menu-action";

contextBridge.exposeInMainWorld("ipc", {
  handleTitleBarAction(action: MenuAction) {
    ipcRenderer.send(IPCChannels.MENU_ACTION, action);
  },
});

declare global {
  interface Window {
    ipc: {
      handleTitleBarAction(action: MenuAction): void;
    };
  }
}
