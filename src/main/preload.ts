import { contextBridge, ipcRenderer } from "electron";
import fs from "fs-extra";
import { fork, exec } from "child_process";

import path from "path";
import Store from "electron-store";
import { v4 as uuid } from "uuid";

import { IPCChannel } from "src/models/ipc-channel";
import { MenuAction } from "src/models/menu-action";
import { defaultOptions, Options } from "src/stores/OptionsStore";
import { Project, ProjectInfo } from "src/models/project";
import { fileExtensionWithoutDot } from "src/models/file-extension";

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

  async isDirectoryEmpty(dir: string): Promise<boolean> {
    const files = fs.readdirSync(dir);

    return files.length === 0;
  },

  openPathInExplorer(dir: string): void {
    ipcRenderer.send(IPCChannel.OPEN_PATH_IN_EXPLORER, dir);
  },

  async getNameFromBotFile(projectPath: string): Promise<string> {
    const config: Project = fs.readJSONSync(projectPath, "utf8");
    return config.settings.name;
  },

  async getProjectFromBotFile(projectPath: string): Promise<Project> {
    const config: Project = fs.readJSONSync(projectPath, "utf8");
    return config;
  },
};

interface AppStore {
  options: Options;
  projects: string[];
}

const store = new Store<AppStore>({ defaults: { options: defaultOptions, projects: [] } });
const storeBridge = {
  getOptions(): Options {
    return store.get("options");
  },

  setOptions(options: Options): void {
    store.set("options", options);
  },

  setProjects(projects: string[]): void {
    store.set("projects", projects);
  },

  getProjects(): string[] {
    const projects = store.get("projects");
    console.log(projects);

    return projects;
  },
};

const templateBridge = {
  async emptyFolder(dest: string): Promise<void> {
    await fs.emptyDir(dest);
  },

  async copyTemplate(dest: string, name: string): Promise<string> {
    const config = await import("./template/config");

    const botPath = path.join(dest, `${name}.${fileExtensionWithoutDot}`);
    const botFile = config.botFile;
    botFile.settings.name = name;
    fs.writeFileSync(botPath, JSON.stringify(botFile));

    return botPath;
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
