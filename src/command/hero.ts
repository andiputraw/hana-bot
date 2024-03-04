import { Model } from "../model/mod.ts";
import { cacheDocument } from "../queue/mod.ts";
import { Command, CommandResponse, CommonPayload } from "../types.ts";
import { HeroCache } from "../queue/mod.ts";
import { Message } from "../helpers/responses/mod.ts";
import { heroMessage } from "../helpers/mod.ts";
import { getAlias } from "@/alias.ts";
import { search } from "@/src/utils/mod.ts";
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
    const heroModel = Model.getHero();
    const nameWithSpace = getAlias(request.options[0].value) ||
      request.options[0].value;
    const [lists, ok1] = await heroModel.getHeroList();
    if (!ok1) {
      return new Message().setContent(
        "Sorry i have not prepared for today's task. can you ask me later?",
      ).build();
    }
    const result = search(lists, nameWithSpace)[0];
    const name = result.item.name.replaceAll(" ", "+");
    const urlLink =
      `https://guardiantalesguides.com/game/guardians/show/${name}`;
    const [hero, ok2] = await heroModel.getHero(result.item.name);
    if (!ok2) {
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
    const embed = heroMessage(
      {
        abilities: hero.abilities,
        stats: hero.stats,
        name: nameWithSpace,
        metadata: hero.metadatas,
      },
      hero.img,
      urlLink,
    );
    return embed.build();
  },
};
