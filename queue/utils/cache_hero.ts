import { sendMessage } from "../../api/discord.ts";
import { heroMessage } from "@/helpers/mod.ts";
import {
  getDocument,
  getHtml,
  parseHeroAbilities,
  parseHeroStats,
} from "../../utils/mod.ts";
import { GetDocumentMessage, isHeroCache } from "../interfaces.ts";
import { CONSTANT } from "@/config/constant.ts";
import { Message } from "@/helpers/responses/mod.ts";

export async function cacheHero(msg: GetDocumentMessage, kv: Deno.Kv) {
  if (!isHeroCache(msg.data)) {
    return;
  }
  console.log(msg);
  const data = await getHtml(msg.link);
  if (!data) {
    console.error("data not found");
    sendMessage(
      new Message().setContent("Sorry, i dont have information about that.")
        .build(),
      msg.channelId,
    );
    return;
  }
  const doc = getDocument(data);
  if (!doc) {
    console.error("document corrupted");
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
    console.error("document does not have guardian info");
    return;
  }
  if (!descWrap) {
    sendMessage(
      new Message().setContent("Sorry, i dont have information about that.")
        .build(),
      msg.channelId,
    );
    console.error("document does not have stats class name");
    return;
  }

  if (!thumbnailWrap) {
    new Message().setContent("Sorry, i dont have information about that.")
      .build(), console.error("document does not have thumbnail");
    return;
  }
  const thumbnail = thumbnailWrap.getElementsByTagName("img")[0].getAttribute(
    "src",
  );
  const thumbnailUrl = CONSTANT.GUARDIAN_TALES_GUIDE_BASE_URL + thumbnail;
  await kv.set(["hero", msg.data.heroName, "info"], infoWrap.innerHTML);
  await kv.set(["hero", msg.data.heroName, "desc"], descWrap.innerHTML);
  await kv.set(
    ["hero", msg.data.heroName, "thumbnail"],
    thumbnailUrl,
  );

  const stats = descWrap.getElementsByTagName("div");
  const abilities = infoWrap.getElementsByClassName("info");
  console.log(stats[0].innerHTML);
  const fieldsStats = parseHeroStats(stats);
  const fieldsAbilities = parseHeroAbilities(abilities);
  const embed = heroMessage(
    fieldsStats,
    fieldsAbilities,
    thumbnailUrl,
    msg.link,
  );
  embed.setContent(" ");
  sendMessage(embed.build(), msg.channelId);
}
