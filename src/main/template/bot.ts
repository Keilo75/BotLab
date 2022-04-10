import { Client, Intents } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {});

client.on("interactionCreate", () => {});

client.login("INSERT_TOKEN_HERE");
