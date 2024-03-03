import { discordRequest } from "@/lib/discord.ts";
import { CommandResponse } from "../types.ts";
import { log } from "../utils/mod.ts";

export async function sendMessage(content: CommandResponse, channelId: string) {
  const response = await discordRequest(`/channels/${channelId}/messages`, {
    body: content.data,
    method: "POST",
  });
  if (!response.ok) {
    const error = await response.json();
    log(error);
  }
}

export async function editMessage(content: string, interactionToken: string) {
  const response = await discordRequest(
    `/webhooks/${content}/${interactionToken}/messages/@original`,
    {
      body: {
        content,
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    log(error);
  }
}
