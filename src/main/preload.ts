import { contextBridge, ipcRenderer } from "electron";
import fs from "fs-extra";
import { fork, exec } from "child_process";

import path from "path";
import Store from "electron-store";

import { IPCChannels } from "src/models/ipc-channels";
import { MenuAction } from "src/models/menu-action";
import { defaultOptions, Options } from "src/stores/optionsStore";

let appPaths = {
  userData: "",
};

(async () => {
  appPaths = await ipcRenderer.invoke(IPCChannels.GET_APP_PATHS);
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
  async emptyFolder(dest: string): Promise<void> {
    await fs.emptyDir(dest);
  },

  async copyTemplate(dest: string, name: string): Promise<void> {
    const config = await import("./template/config.json");

    config.package.name = name.toLowerCase().replace(/\s+/g, "-");

    const packagePath = path.join(dest, `package.json`);
    fs.writeFileSync(packagePath, JSON.stringify(config.package));

    await sleep(500);
    return;
  },

  async installDependencies(dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // TODO: Don't use globally installed version
      const cli = "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js";
      const args = ["indsstall"];

      // Run installer
      const installer = fork(cli, args, {
        silent: true,
        cwd: dest,
      });

      installer.on("exit", async (code) => {
        if (code === 0) {
          await sleep(500);
          resolve();
        } else {
          reject();
        }
      });
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

const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
};
