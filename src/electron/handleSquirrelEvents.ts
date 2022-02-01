import { app } from "electron";

export async function handleSquirrelEvents(): Promise<boolean> {
  if (process.argv.length === 1) {
    return false;
  }

  switch (process.argv[1]) {
    case "--squirrel-install":
    case "--squirrel-updated": {
      return true;
    }

    case "--squirrel-uninstall":
      app.quit();
      return true;

    case "--squirrel-obsolete":
      return true;

    default:
      return false;
  }
}
