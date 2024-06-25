import { Command, CommonPayload } from "@/src/types.ts";
import { Message } from "@/src/helpers/responses/mod.ts";
import { MessageType, addUnlistedHero } from "@/src/queue/mod.ts";
interface CommandRequest {
  type: number;
}

export const refresh: Command = {
  execute: async (_request: CommandRequest, payload: CommonPayload) => {
    if (payload.member.user.id === Deno.env.get("DISCORD_OWNER_ID")) {
      await addUnlistedHero({
        channelId: payload.channel.id,
        type: MessageType.AddUnlisted,
      });
      return new Message().setContent("Refreshing..").build();
    }
    return new Message().setContent("This command is not available").build();
  },
};
