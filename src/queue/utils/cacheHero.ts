import { sendMessage } from "@/src/api/discord.ts";
import { heroMessage } from "@/src/helpers/mod.ts";
import {
  getDocument,
  getHtml,
  LogType,
  parseHeroAbilities,
  parseHeroStats,
} from "@/src/utils/mod.ts";
import { GetDocumentMessage, isHeroCache } from "@/src/queue/interfaces.ts";
import { CONSTANT } from "@/src/config/constant.ts";
import { Message } from "@/src/helpers/responses/mod.ts";
import { log } from "@/src/utils/mod.ts";
import { Model } from "@/src/model/mod.ts";

export async function cacheHero(msg: GetDocumentMessage, kv: Deno.Kv) {
  log(LogType.Info, "cacheHero: ", msg);
  const hero = Model.getHero();

  if (!isHeroCache(msg.data)) {
    return;
  }
  const data = await getHtml(msg.link);
  if (!data) {
    log(LogType.Error, "data not found");
    sendMessage(
      new Message().setContent("Sorry, i dont have information about that.")
        .build(),
      msg.channelId,
    );
    return;
  }
  const doc = getDocument(data);
  if (!doc) {
    log(LogType.Error, "document corrupted");
    sendMessage(
      new Message().setContent("Sorry, i dont have information about that.")
        .build(),
      msg.channelId,
    );
    return;
  }
  const infoWrap = doc.getElementById("guardianInfo");
  const descWrap = doc.getElementsByClassName("stats")[0];
  const thumbnailWrap = doc.getElementsByClassName("portrait")[0];

  if (!infoWrap) {
    sendMessage(
      new Message().setContent("Sorry, i dont have information about that.")
        .build(),
      msg.channelId,
    );
    log(LogType.Error, "document does not have guardian info");
    return;
  }
  if (!descWrap) {
    sendMessage(
      new Message().setContent("Sorry, i dont have information about that.")
        .build(),
      msg.channelId,
    );
    log(LogType.Error, "document does not have stats class name");
    return;
  }

  if (!thumbnailWrap) {
    sendMessage(
      new Message().setContent("Sorry, i dont have information about that.")
        .build(),
      msg.channelId,
    );
    log(LogType.Error, "document does not have thumbnail");
    return;
  }
  const thumbnail = thumbnailWrap.getElementsByTagName("img")[0].getAttribute(
    "src",
  );
  const thumbnailUrl = CONSTANT.GUARDIAN_TALES_GUIDE_BASE_URL + thumbnail;
  // await kv.set(["hero", msg.data.heroName, "info"], infoWrap.innerHTML);
  // await kv.set(["hero", msg.data.heroName, "desc"], descWrap.innerHTML);
  // await kv.set(
  //   ["hero", msg.data.heroName, "thumbnail"],
  //   thumbnailUrl,
  // );

  const stats = descWrap.getElementsByTagName("div");
  const abilities = infoWrap.getElementsByClassName("info");
  const fieldsStats = parseHeroStats(stats);
  const fieldsAbilities = parseHeroAbilities(abilities);

  const element = fieldsStats.find((v) => v[0] === "Element:");
  const buff = fieldsStats.find((v) => v[0] === "Group Buff:");
  const intro = fieldsStats.find((v) => v[0] === "Introduced:");

  const normal = fieldsAbilities.find((v) => v[0] === "Normal Atk");
  const chain = fieldsAbilities.find((v) => v[0].includes("Chain Skill"));
  const ability = fieldsAbilities.find((v) => v[0] === "Special Ability");
  const exwp = fieldsAbilities.find((v) => v[0] === "Ex Weapon");

  const alignment =
    chain?.[0]?.replaceAll("Chain Skill", "")?.replaceAll("->", "→") ?? "";

  const heroStats = {
    element: element![1],
    teamBuff: buff![1],
    introduced: intro ? intro![1] : undefined,
  };
  const heroAbitlities = {
    chainSkill: {
      alignment,
      desc: chain![1],
    },
    normalAtk: normal![1],
    specialAbility: ability![1],
    exWp: exwp![1],
  };
  log(LogType.Info, "Hero Stats: ", heroStats);
  log(LogType.Info, "Hero Abilities: ", heroAbitlities);
  hero.setHero(
    msg.data.heroName,
    thumbnailUrl,
    heroStats,
    heroAbitlities,
    {},
  );

  const embed = heroMessage(
    {
      name: msg.data.heroName,
      stats: heroStats,
      abilities: heroAbitlities,
      metadata: {},
    },
    thumbnailUrl,
    msg.link,
  );

  embed.setContent(" ");
  sendMessage(embed.build(), msg.channelId);
}
