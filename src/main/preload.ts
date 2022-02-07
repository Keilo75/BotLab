import { app, contextBridge, ipcRenderer } from "electron";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import Store from "electron-store";

import { IPCChannels } from "src/models/ipc-channels";
import { MenuAction } from "src/models/menu-action";
import { defaultOptions, Options } from "src/stores/optionsStore";

let appPath: string;

(async () => {
  appPath = await ipcRenderer.invoke(IPCChannels.GET_APP_PATH);
})();

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

interface AppStore {
  options: Options;
}
const store = new Store<AppStore>({ defaults: { options: defaultOptions } });
const storeBridge = {
  getOptions(): Options {
    return store.get("options");
  },

  setOptions(options: Options): void {
    store.set("options", options);
  },
};

const templateBridge = {
  async copyTemplate(dest: string): Promise<void> {
    const configs = await import("./template/configs.json");
    ["package.json", "tsconfig.json"].forEach((key) => {
      const config = configs[key as "package.json" | "tsconfig.json"];
      const configPath = path.join(dest, key);
      fs.writeFileSync(configPath, JSON.stringify(config));
    });

    return;
  },

  async installDependencies(): Promise<void> {
    exec("npm", (error, stdout, stderr) => {
      console.log(stdout);
    });
  },
};

contextBridge.exposeInMainWorld("ipc", ipcBridge);
contextBridge.exposeInMainWorld("fs", fsBridge);
contextBridge.exposeInMainWorld("store", storeBridge);
contextBridge.exposeInMainWorld("template", templateBridge);

declare global {
  interface Window {
    ipc: typeof ipcBridge;
    fs: typeof fsBridge;
    store: typeof storeBridge;
    template: typeof templateBridge;
  }
}
