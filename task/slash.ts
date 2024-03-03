import commandsJson from "@/task/config/slash.json" with { type: "json" };
import { load } from "std/dotenv/mod.ts";
import { discordRequest } from "@/lib/discord.ts";
await load({ export: true });

console.log("Is it global?");
const isGlobal = confirm();
const env = Deno.env.get("ENV");
let commands = commandsJson;
if (env !== "PRODUCTION") {
  commands = commandsJson.map((v) => ({ ...v, name: `dev_${v.name}` }));
}
console.log("What action you want to do?");
console.log("1. Get currently active slash command.");
console.log("2. Create a specific clash command.");
console.log("3. Create all slash command.");
console.log("4. Delete a slash command.");
console.log("5. Delete all slash command.");

const result = doPrompt();
console.clear();

switch (result) {
  case "1": {
    const response = await getActiveSlashCommand();
    console.log("List of all command: ");
    for (const command of response) {
      console.log(command.name);
    }
    break;
  }
  case "2":
    console.log("Delete a slash command.");
    break;
  case "3":
    await createAllSlashCommand();
    break;
  case "4":
    break;
  case "5":
    await deleteAllSlashCommand();
    break;
}

function doPrompt(): string {
  let choice: string | null = null;

  do {
    choice = prompt("Enter your choice: ");
  } while (!choice);
  return choice as string;
}

async function getActiveSlashCommand() {
  const endPoint = !isGlobal
    ? `/applications/${Deno.env.get("DISCORD_APP_ID")}/guilds/${
      Deno.env.get("GUILD_ID")
    }/commands`
    : `/applications/${Deno.env.get("DISCORD_APP_ID")}/commands`;
  const response = await discordRequest(endPoint, {
    method: "GET",
  });
  const responseJson = await response.json();
  return responseJson;
}

async function deleteAllSlashCommand() {
  const activeSlashCommand = await getActiveSlashCommand();
  for (const command of activeSlashCommand) {
    const endPoint = !isGlobal
      ? `/applications/${Deno.env.get("DISCORD_APP_ID")}/guilds/${
        Deno.env.get("GUILD_ID")
      }/commands/${command.id}`
      : `/applications/${
        Deno.env.get("DISCORD_APP_ID")
      }/commands/${command.id}`;
    const response = await discordRequest(endPoint, {
      method: "DELETE",
    });
    const status = response.status;
    if (status === 204) {
      console.log("Deleted command: ", command.name);
    } else {
      console.log("Failed to delete command: ", command.name);
    }
  }
}

async function createAllSlashCommand() {
  const endPoint = !isGlobal
    ? `/applications/${Deno.env.get("DISCORD_APP_ID")}/guilds/${
      Deno.env.get("GUILD_ID")
    }/commands`
    : `/applications/${Deno.env.get("DISCORD_APP_ID")}/commands`;
  for (const command of commands) {
    const response = await discordRequest(endPoint, {
      method: "POST",
      body: command,
    });
    const responseJson = await response.json();
    console.log(responseJson);
  }
}
