import { contextBridge, ipcRenderer } from "electron";
import fs from "fs-extra";
import { fork, exec } from "child_process";

import path from "path";
import Store from "electron-store";

import { IPCChannel } from "src/models/ipc-channel";
import { MenuAction } from "src/models/menu-action";
import { defaultOptions, Options } from "src/stores/OptionsStore";
import { sleep } from "src/lib/sleep";
import { Project } from "src/models/project";

let appPaths = {
  userData: "",
};

(async () => {
  appPaths = await ipcRenderer.invoke(IPCChannel.GET_APP_PATHS);
})();

const ipcBridge = {
  handleTitleBarAction(action: MenuAction) {
    ipcRenderer.send(IPCChannel.MENU_ACTION, action);
  },
};

const fsBridge = {
  async openDialog(options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue> {
    return await ipcRenderer.invoke(IPCChannel.OPEN_DIALOG, options);
  },

  async isDirectoryEmpty(path: string): Promise<boolean> {
    const files = fs.readdirSync(path);

    return files.length === 0;
  },
};

interface AppStore {
  options: Options;
  projects: Project[];
}

const store = new Store<AppStore>({ defaults: { options: defaultOptions, projects: [] } });
const storeBridge = {
  getOptions(): Options {
    return store.get("options");
  },

  setOptions(options: Options): void {
    store.set("options", options);
  },

  setProjects(projects: Project[]): void {
    store.set("projects", projects);
  },

  getProjects(): Project[] {
    const projects = store.get("projects");
    console.log(projects);

    return projects;
  },
};

const templateBridge = {
  async emptyFolder(dest: string): Promise<void> {
    await fs.emptyDir(dest);
  },

  async copyTemplate(dest: string, name: string): Promise<void> {
    const config = await import("./template/config.json");

    config.package.name = name.toLowerCase().replace(/\s+/g, "-");
    config.package.productName = name;

    const packagePath = path.join(dest, `package.json`);
    fs.writeFileSync(packagePath, JSON.stringify(config.package));

    const dataPath = path.join(dest, "data");
    await fs.mkdir(dataPath);

    const data = ["commands", "settings"] as (keyof typeof config)[];
    for (const key of data) {
      fs.writeFileSync(path.join(dataPath, key + ".json"), JSON.stringify(config[key]));
    }

    await sleep(500);
    return;
  },

  async installDependencies(dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // TODO: Don't use globally installed version
      const cli = "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js";
      const args = ["install"];

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
