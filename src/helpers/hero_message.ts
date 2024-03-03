import { Embed } from "./responses/mod.ts";

type HerorMessageOption = {
  thumbnail: string;
  link: string;
};

/**
 * create embed message from stats and abilities
 * @param stats the first value of stats will be the title
 * @param abilities
 * @param thumbnail
 * @returns embed that cn be used for response
 */
export function heroMessage(
  stats: Array<[string, string]>,
  abilities: Array<[string, string]>,
  thumbnail: string,
  link: string,
): Embed {
  const [_, heroName] = stats.shift() ?? ["unknown", "unknown"];
  const embed = new Embed().setTitle(heroName);
  let builder = "";
  for (const [field, value] of stats) {
    builder += `*${field}* : ${value}\n`;
  }
  embed.setDescription(builder);

  for (const [field, value] of abilities) {
    embed.addField(field, value);
  }
  embed.setThumbnail(thumbnail);
  // embed.setFooter(`Credit: ${link}`);
  embed.setUrl(link);

  return embed;
}
