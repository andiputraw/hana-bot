import { getDocument } from "../utils/document.ts";
import { parseHeroAbilities, parseHeroStats } from "../utils/parser.ts";
import { cache } from "../database/mod.ts";
import { cacheDocument } from "../queue/mod.ts";
import { Command, CommandResponse, CommonPayload } from "../types.ts";
import { HeroCache } from "../queue/mod.ts";
import { Message } from "../helpers/responses/mod.ts";
import { heroMessage } from "../helpers/mod.ts";
import { getAlias } from "@/alias.ts";

interface HeroRequest {
  id: string;
  name: string;
  options: [
    { name: string; type: number; value: string },
  ];
  type: number;
}

export const hero: Command = {
  async execute(
    request: HeroRequest,
    payload: CommonPayload,
  ): Promise<CommandResponse> {
    const nameWithSpace = getAlias(request.options[0].value) ||
      request.options[0].value;
    const name = nameWithSpace.replaceAll(" ", "+");
    const [infoCache, ok1] = await cache.getCache<string>("hero", name, "info");
    const [descCache, ok2] = await cache.getCache<string>("hero", name, "desc");
    const [thumbCache, ok3] = await cache.getCache<string>(
      "hero",
      name,
      "thumbnail",
    );
    const urlLink =
      `https://guardiantalesguides.com/game/guardians/show/${name}`;

    if (!ok1 || !ok2 || !ok3) {
      //If cache miss
      await cacheDocument({
        channelId: payload.channel.id,
        cacheType: "hero",
        data: ({
          heroName: name,
        } satisfies HeroCache),
        link: urlLink,
      });
      return new Message().setContent("wait a second").build();
    }
    //if hit
    const el = getDocument(infoCache);
    if (!el) {
      return new Message().setContent("document corrupted").build();
    }
    const infos = el.getElementsByClassName("info");
    const desc = getDocument(descCache);
    if (!desc) {
      return new Message().setContent("document corrupted").build();
    }
    const stats = desc.getElementsByTagName("div");

    const fieldStat = parseHeroStats(stats);

    const fieldsAbilities = parseHeroAbilities(infos);
    const embed = heroMessage(fieldStat, fieldsAbilities, thumbCache, urlLink);
    return embed.build();
  },
};
