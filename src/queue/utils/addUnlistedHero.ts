import { AddUnlistedMessage } from "@/src/queue/interfaces.ts";
import { Model } from "@/src/model/model.ts";
import { LogType, getDocument, getHtml, log } from "@/src/utils/mod.ts";
import { sendMessage } from "@/src/api/discord.ts";
import { Message } from "@/src/helpers/responses/mod.ts";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Add unlisted heroes, because this is only mean to be used for owner,
 * the error can be more descriptive
 */
export async function addUnlistedHero(msg: AddUnlistedMessage) {
  const heroModel = Model.getHero();

  const html = await getHtml("https://guardiantalesguides.com/game/guardians");
  const doc = getDocument(html || "");

  if (!doc) {
    log(LogType.Error, "doc not found");
    sendMessage(
      new Message().setContent("Document not found").build(),
      msg.channelId
    );
    return;
  }

  const innerContent = doc.getElementById("innerContent");
  const els = innerContent?.getElementsByClassName("portrait");
  if (!els) {
    log(LogType.Error, "Inner content broken");
    sendMessage(
      new Message().setContent("Document not found").build(),
      msg.channelId
    );
    return;
  }
  const heroes = els.map((el) => {
    const imgEl = el.getElementsByTagName("img")[0];
    const nameEl = el.getElementsByClassName("detail")[0];

    const img = imgEl.getAttribute("src") || "";
    const name = nameEl.textContent;
    return {
      name,
      img,
    };
  });

  const unlisted = await heroModel.getUnlistedHero(heroes.map((v) => v.name));
  console.log(unlisted);
  const unlistedHeroes = heroes.filter((v) => unlisted.includes(v.name));

  const count = unlistedHeroes.length;
  const promises = unlistedHeroes.map((hero) => {
    return heroModel.addHero(hero.name, hero.img);
  });

  await Promise.all(promises);
  sendMessage(
    new Message().setContent(`Completed, added ${count} hero`).build(),
    msg.channelId
  );
}
