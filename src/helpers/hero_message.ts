import { Embed } from "./responses/mod.ts";
import { HeroAbilities, HeroMetadata, HeroStats } from "@/src/model/mod.ts";

type HerorMessageOption = {
  thumbnail: string;
  link: string;
};

type HeroBioData = {
  name: string;
  stats: HeroStats;
  abilities: HeroAbilities;
  metadata?: HeroMetadata;
};

/**
 * create embed message from stats and abilities
 * @param stats the first value of stats will be the title
 * @param abilities
 * @param thumbnail
 * @returns embed that cn be used for response
 */
export function heroMessage(
  data: HeroBioData,
  thumbnail: string,
  link: string,
): Embed {
  const heroName = data.name;
  const embed = new Embed().setTitle(heroName);
  let builder = "";
  builder += `Element: ${data.stats.element}\n`;
  builder += `Team Buff: ${data.stats.teamBuff}\n`;
  if (data.stats.introduced) {
    builder += `Introduced: ${data.stats.introduced}\n`;
  }

  embed.setDescription(builder);

  embed.addField("Normal Attack", data.abilities.normalAtk);
  embed.addField(
    `Chain Skill ${data.abilities.chainSkill.alignment}`,
    data.abilities.chainSkill.desc,
  );
  embed.addField("Special Ability", data.abilities.specialAbility);
  embed.addField("Ex Weapon", data.abilities.exWp);

  if (data.metadata) {
    if (data.metadata.seeAlso) {
      embed.addField("See Also: ", data.metadata.seeAlso);
    }
  }
  embed.setThumbnail(thumbnail);
  // embed.setFooter(`Credit: ${link}`);
  embed.setUrl(link);

  return embed;
}
