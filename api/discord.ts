import { CommandResponse } from "@/types.ts";
import { log } from "@/utils/mod.ts";

// Code adapted from https://github.com/discord/discord-example-app/blob/main/utils.js
export async function discordRequest(endpoint: string, options: any) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${Deno.env.get("DISCORD_BOT_TOKEN")}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent": "HanaBot (url soon, 0.0.1)",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    log(res.status);
    log(data);
    return res;
  }
  // return original response
  return res;
}

export async function sendMessage(content: CommandResponse, channelId: string) {
  await discordRequest(`/channels/${channelId}/messages`, {
    body: content.data,
    method: "POST",
  });
}

export async function editMessage(content: string, interactionToken: string) {
  await discordRequest(
    `/webhooks/${content}/${interactionToken}/messages/@original`,
    {
      body: {
        content,
      },
    },
  );
}
