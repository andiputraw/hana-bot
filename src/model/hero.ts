import { HeroDB } from "./interface.ts";
import { heroes } from "@/src/model/turso/schema/schema.ts";
import { HeroAbilities, HeroMetadata, HeroStats } from "./types.ts";

class Hero {
  #db;
  constructor(db: HeroDB) {
    this.#db = db;
  }

  /**
   * Set the hero stats for a given name.
   *
   * @param {string} name - the name of the hero
   * @param {HeroStats} stats - the stats to set for the hero
   * @return {Promise<boolean>} a boolean indicating if the hero stats were successfully set
   */
  async setHeroStats(name: string, stats: HeroStats): Promise<boolean> {
    return await this.#db.setHeroStats(name, stats);
  }

  /**
   * Set the abilities of a hero.
   *
   * @param {string} name - the name of the hero
   * @param {HeroAbilities} abilities - the abilities to set
   * @return {Promise<boolean>} a Promise that resolves to a boolean indicating the success of setting the hero abilities
   */
  async setHeroAbilities(
    name: string,
    abilities: HeroAbilities
  ): Promise<boolean> {
    return await this.#db.setHeroAbilities(name, abilities);
  }

  /**
   * Set the metadata for a hero.
   *
   * @param {string} name - the name of the hero
   * @param {HeroMetadata} metadatas - the metadata to be set for the hero
   * @return {Promise<boolean>} a promise that resolves to a boolean indicating the success of the operation
   */
  async setHeroMetadatas(
    name: string,
    metadatas: HeroMetadata
  ): Promise<boolean> {
    return await this.#db.setHeroMetadatas(name, metadatas);
  }

  /**
   * Sets a new hero with the given name, image, stats, abilities, and metadata.
   *
   * @param {string} name - the name of the hero
   * @param {string} img - the image of the hero
   * @param {HeroStats} stats - the stats of the hero
   * @param {HeroAbilities} abilities - the abilities of the hero
   * @param {HeroMetadata} metadatas - the metadata of the hero
   * @return {Promise<boolean>} a boolean indicating the success of setting the hero
   */
  async setHero(
    name: string,
    img: string,
    stats: HeroStats,
    abilities: HeroAbilities,
    metadatas: HeroMetadata
  ): Promise<boolean> {
    return await this.#db.setHero(name, img, stats, abilities, metadatas);
  }

  /**
   * Asynchronously retrieves a hero's information from the database.
   *
   * @param {string} name - the name of the hero
   * @return {Promise<[{
   *   stats: HeroStats;
   *   abilities: HeroAbilities;
   *   metadatas: HeroMetadata;
   *   img: string;
   * }, boolean]>} a promise that resolves to a tuple containing the hero's information and a boolean indicating whether the hero was found
   */
  async getHero(name: string): Promise<
    [
      {
        stats: HeroStats;
        abilities: HeroAbilities;
        metadatas: HeroMetadata;
        img: string;
      },
      boolean
    ]
  > {
    return await this.#db.getHero(name);
  }

  /**
   * A function that asynchronously retrieves a list of heroes.
   *
   * @return {Promise<[string[], boolean]>} a promise that resolves to a tuple containing a list of hero names and a boolean indicating whether the operation was successful
   */
  async getHeroList(): Promise<[(typeof heroes.$inferSelect)[], boolean]> {
    return await this.#db.getHeroList();
  }
  async addHero(name: string, img: string) {
    return await this.#db.addHero(name, img);
  }

  async getUnlistedHero(names: string[]): Promise<string[]> {
    return await this.#db.getUnlistedHero(names);
  }
}

export default Hero;
