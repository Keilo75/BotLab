import { Project } from "src/models/project";

export const packageJSON = {
  name: "botlab-template",
  productName: "BotLab Template",
  version: "1.0.0",
  description: "A discord bot",
  main: "index.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  author: "",
  license: "MIT",
  dependencies: {
    "discord.js": "13.6.0",
  },
};

export const botFile: Project = {
  settings: {
    name: "",
    token: "",
  },
  interactions: [],
};
