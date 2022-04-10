import { contextBridge, ipcRenderer, OpenDialogOptions, OpenDialogReturnValue } from "electron";
import {
  readdirSync,
  writeFileSync,
  writeJSONSync,
  readJSONSync,
  emptyDir,
  writeJSON,
  readFileSync,
} from "fs-extra";

import path from "path";
import Store from "electron-store";
import { exec } from "child-process-promise";

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
    const files = readdirSync(dir);

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
    const config: Project = readJSONSync(projectPath, "utf8");
    return config;
  },

  async saveProject(project: Project, projectPath: string): Promise<void> {
    const prettyPrint = storeBridge.getOptions()["developer.prettyPrintSaveFile"];
    writeJSONSync(projectPath, project, { spaces: prettyPrint ? "\t" : undefined });
  },
};

const botBridge = {
  async isBotFolderSetUp(projectPath: string): Promise<boolean> {
    const files = readdirSync(path.dirname(projectPath));
    const necessaryFiles = ["package.json", "node_modules"];

    return necessaryFiles.every((necessaryFile) => files.includes(necessaryFile));
  },

  async isNpmInstalled(): Promise<boolean> {
    try {
      await exec("npm --version");
      return true;
    } catch {
      return false;
    }
  },

  async copyFiles(projectPath: string): Promise<boolean> {
    const { packageJSON } = await import("./template/config");

    const jsonPath = path.join(path.dirname(projectPath), "package.json");
    try {
      await writeJSON(jsonPath, packageJSON, { spaces: "\t" });
      return true;
    } catch {
      return false;
    }
  },

  async installDependencies(projectPath: string): Promise<boolean> {
    try {
      await exec("npm install", { cwd: path.dirname(projectPath) });
      return true;
    } catch {
      return false;
    }
  },

  async compileBot(projectPath: string, project: Project): Promise<void> {
    // @ts-expect-error
    // This file gets imported as a text file
    const { default: template } = await import("./template/bot");
    console.log(template);
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
    await emptyDir(dest);
  },

  async copyTemplate(dest: string, name: string): Promise<string> {
    const { botFile } = await import("./template/config");

    const botPath = path.join(dest, `${name}.${fileExtensionWithoutDot}`);
    botFile.settings.name = name;
    writeFileSync(botPath, JSON.stringify(botFile));

    return botPath;
  },
};

contextBridge.exposeInMainWorld("ipc", ipcBridge);
contextBridge.exposeInMainWorld("fs", fsBridge);
contextBridge.exposeInMainWorld("project", projectBridge);
contextBridge.exposeInMainWorld("bot", botBridge);
contextBridge.exposeInMainWorld("store", storeBridge);
contextBridge.exposeInMainWorld("template", templateBridge);

declare global {
  interface Window {
    ipc: typeof ipcBridge;
    fs: typeof fsBridge;
    project: typeof projectBridge;
    bot: typeof botBridge;
    store: typeof storeBridge;
    template: typeof templateBridge;
  }
}
