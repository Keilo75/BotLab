import { contextBridge, ipcRenderer } from "electron";
import fs from "fs";

import { IPCChannels } from "src/models/ipc-channels";
import { MenuAction } from "src/models/menu-action";

const ipcBridge = {
  handleTitleBarAction(action: MenuAction) {
    ipcRenderer.send(IPCChannels.MENU_ACTION, action);
  },
};

const fsBridge = {
  async openDialog(options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue> {
    return await ipcRenderer.invoke(IPCChannels.OPEN_DIALOG, options);
  },

  async isDirectoryEmpty(path: string): Promise<boolean> {
    const files = fs.readdirSync(path);
    return files.length === 0;
  },
};

contextBridge.exposeInMainWorld("ipc", ipcBridge);
contextBridge.exposeInMainWorld("fs", fsBridge);

declare global {
  interface Window {
    ipc: typeof ipcBridge;
    fs: typeof fsBridge;
  }
}
