import { HeroAbilities, HeroMetadata, HeroStats } from "./types.ts";
export interface Database {
  // deno-lint-ignore no-explicit-any
  get<T = any>(key: string[]): Promise<[T, boolean]>;
  set<T>(key: string[], value: T): Promise<boolean>;
}

export interface HeroDB {
  /**
   * Set the hero with the specified name, image, stats, abilities, and metadata.
   *
   * @param {string} name - the name of the hero
   * @param {string} img - the image URL of the hero
   * @param {HeroStats} stats - the stats of the hero
   * @param {HeroAbilities} abilities - the abilities of the hero
   * @param {HeroMetadata} metadatas - the metadata of the hero
   * @return {Promise<boolean>} a Promise that resolves to true if the hero is successfully set
   */
  setHero(
    name: string,
    img: string,
    stats: HeroStats,
    abilities: HeroAbilities,
    metadatas: HeroMetadata,
  ): Promise<boolean>;

  /**
   * Retrieves information about a hero.
   *
   * @param {string} name - The name of the hero
   * @return {Promise<[ { stats: HeroStats; abilities: HeroAbilities; metadatas: HeroMetadata; img: string; }, boolean, ]>} A promise that resolves to tuple containing hero information and a boolean value. if the hero is not found, the first item is undefined and the second item is false
   */
  getHero(
    name: string,
  ): Promise<
    [
      {
        stats: HeroStats;
        abilities: HeroAbilities;
        metadatas: HeroMetadata;
        img: string;
      },
      boolean,
    ]
  >;
  /**
   * Retrieves a list of hero names.
   *
   * @return {Promise<[string[], boolean]>} A promise that resolves to a tuple of hero names and a boolean value. if the list is empty, the boolean value is false
   */
  getHeroList(): Promise<[string[], boolean]>;
  /**
   * Set the stats of the hero with the specified name.
   *
   * @param {string} name - the name of the hero
   * @param {HeroStats} stats - the stats of the hero
   * @return {Promise<boolean>} a Promise that resolves to true if the stats are successfully set
   */
  setHeroStats(name: string, stats: HeroStats): Promise<boolean>;

  /**
   *  Set the abilities of the hero with the specified name.
   *
   * @param {string} name - the name of the hero
   * @param {HeroAbilities} abilities - the abilities of the hero
   * @return {Promise<boolean>} a Promise that resolves to true if the abilities are successfully set
   */
  setHeroAbilities(name: string, abilities: HeroAbilities): Promise<boolean>;
  /**
   *  Set the metadata of the hero with the specified name.
   *
   * @param {string} name - the name of the hero
   * @param {HeroMetadata} metadatas - the metadata of the hero
   * @return {Promise<boolean>} a Promise that resolves to true if the metadata are successfully set
   */
  setHeroMetadatas(name: string, metadatas: HeroMetadata): Promise<boolean>;
}
