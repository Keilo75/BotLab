import { contextBridge, ipcRenderer, OpenDialogOptions, OpenDialogReturnValue } from "electron";
import fs from "fs-extra";

import path from "path";
import Store from "electron-store";

import { IPCChannel } from "src/models/ipc-channel";
import { MenuAction } from "src/models/menu-action";
import { defaultOptions, Options } from "src/stores/OptionsStore";
import { Project } from "src/models/project";
import { fileExtensionWithoutDot } from "src/models/file-extension";

const ipcBridge = {
  handleTitleBarAction(action: MenuAction) {
    ipcRenderer.send(IPCChannel.MENU_ACTION, action);
  },
};

const fsBridge = {
  async openDialog(options: OpenDialogOptions): Promise<OpenDialogReturnValue> {
    return await ipcRenderer.invoke(IPCChannel.OPEN_DIALOG, options);
  },

  async isDirectoryEmpty(dir: string): Promise<boolean> {
    const files = fs.readdirSync(dir);

    return files.length === 0;
  },

  openPathInExplorer(dir: string): void {
    ipcRenderer.send(IPCChannel.OPEN_PATH_IN_EXPLORER, dir);
  },

  openLinkInBrowser(link: string): void {
    ipcRenderer.send(IPCChannel.OPEN_LINK_IN_BROWSER, link);
  },
};

const projectBridge = {
  openProjectInExplorer(projectPath: string): void {
    const projectDir = path.dirname(projectPath);
    fsBridge.openPathInExplorer(projectDir);
  },

  async getProjectFromBotFile(projectPath: string): Promise<Project> {
    const config: Project = fs.readJSONSync(projectPath, "utf8");
    return config;
  },

  async saveProject(project: Project, projectPath: string): Promise<void> {
    fs.writeJSONSync(projectPath, project, { spaces: "\t" });
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
    return store.get("projects");
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
};

contextBridge.exposeInMainWorld("ipc", ipcBridge);
contextBridge.exposeInMainWorld("fs", fsBridge);
contextBridge.exposeInMainWorld("project", projectBridge);
contextBridge.exposeInMainWorld("store", storeBridge);
contextBridge.exposeInMainWorld("template", templateBridge);

declare global {
  interface Window {
    ipc: typeof ipcBridge;
    fs: typeof fsBridge;
    project: typeof projectBridge;
    store: typeof storeBridge;
    template: typeof templateBridge;
  }
}
