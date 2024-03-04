import { HeroDB } from "../interface.ts";
import { LibSQLDatabase } from "drizzle/libsql";
import { HeroAbilities, HeroMetadata, HeroStats } from "../types.ts";

import * as schema from "./schema/schema.ts";
import { and, eq } from "drizzle";

class Turso implements HeroDB {
  #db: LibSQLDatabase;
  constructor(db: LibSQLDatabase) {
    this.#db = db;
  }

  async getHero(
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
  > {
    const heroes = await this.#db
      .select()
      .from(schema.heroes)
      .where(eq(schema.heroes.name, name));
    if (!heroes[0]) {
      // deno-lint-ignore no-explicit-any
      return [undefined as any, false];
    }
    const hero = heroes[0];
    const data = await this.#db.select().from(schema.heroData).where(
      eq(schema.heroData.hero_id, hero.id),
    );
    if (data.length === 0) {
      return [undefined as any, false];
    }
    const [stats] = data
      .filter((v) => v.type === schema.HeroDataType.Stats)
      .map((v) => v.value as HeroStats);
    const [abilities] = data
      .filter((v) => v.type === schema.HeroDataType.Abilities)
      .map((v) => v.value as HeroAbilities);
    const [metadatas] = data
      .filter((v) => v.type === schema.HeroDataType.Metadata)
      .map((v) => v.value as HeroMetadata);

    // const [stats] = await this.#db.select().from(schema.heroStats).where(eq(
    //   schema.heroStats.hero_id,
    //   hero.id,
    // ));
    // const [abilities] = await this.#db.select().from(schema.heroAbilities)
    //   .where(
    //     eq(schema.heroAbilities.hero_id, hero.id),
    //   );
    // const [metadatas] = await this.#db.select().from(schema.heroMetadatas)
    //   .where(
    //     eq(schema.heroMetadatas.hero_id, hero.id),
    //   );
    return [
      {
        stats: stats,
        abilities: abilities,
        metadatas: metadatas,
        img: hero.img,
      },
      true,
    ];
  }

  async setHero(
    name: string,
    img: string,
    stats: HeroStats,
    abilities: HeroAbilities,
    metadatas: HeroMetadata,
  ): Promise<boolean> {
    let [hero] = await this.#db.select().from(schema.heroes).where(eq(
      schema.heroes.name,
      name,
    ));
    if (hero) {
      return false;
    }
    hero = (await this.#db.insert(schema.heroes).values({ name, img })
      .returning())[0];
    const heroId = hero.id;

    await this.#db.insert(schema.heroData).values({
      type: schema.HeroDataType.Stats,
      hero_id: heroId,
      value: stats,
    });
    await this.#db.insert(schema.heroData).values({
      type: schema.HeroDataType.Abilities,
      hero_id: heroId,
      value: abilities,
    });
    await this.#db.insert(schema.heroData).values({
      type: schema.HeroDataType.Metadata,
      hero_id: heroId,
      value: metadatas,
    });
    return true;
  }

  async getHeroList(): Promise<[typeof schema.heroes.$inferSelect[], boolean]> {
    const heroes = await this.#db.select().from(
      schema.heroes,
    );
    return [heroes, true];
  }

  async #setSomething<V, T>(
    id: number,
    val: any,
    type: schema.HeroDataType,
  ): Promise<boolean> {
    const [value] = await this.#db
      .select()
      .from(schema.heroData)
      .where(
        and(eq(schema.heroData.hero_id, id), eq(schema.heroData.type, type)),
      );
    if (value) {
      await this.#db
        .update(schema.heroData)
        .set({ value: val })
        .where(
          and(eq(schema.heroData.hero_id, id), eq(schema.heroData.type, type)),
        );
    } else {
      await this.#db.update(schema.heroData).set({ value: val }).where(
        and(eq(schema.heroData.hero_id, id), eq(schema.heroData.type, type)),
      );
    }
    return true;
  }

  async setHeroStats(name: string, stats: HeroStats): Promise<boolean> {
    const [hero] = await this.#db.select().from(schema.heroes).where(eq(
      schema.heroes.name,
      name,
    ));
    if (!hero) {
      return false;
    }
    this.#setSomething(hero.id, stats, schema.HeroDataType.Stats);
    return true;
  }

  async setHeroAbilities(
    name: string,
    abilities: HeroAbilities,
  ): Promise<boolean> {
    const [hero] = await this.#db.select().from(schema.heroes).where(eq(
      schema.heroes.name,
      name,
    ));
    if (!hero) {
      return false;
    }
    this.#setSomething(hero.id, abilities, schema.HeroDataType.Abilities);
    return true;
  }

  async setHeroMetadatas(
    name: string,
    metadatas: HeroMetadata,
  ): Promise<boolean> {
    const [hero] = await this.#db.select().from(schema.heroes).where(eq(
      schema.heroes.name,
      name,
    ));
    if (!hero) {
      return false;
    }
    this.#setSomething(hero.id, metadatas, schema.HeroDataType.Metadata);
    return true;
  }

  async addHero(name: string, img: string): Promise<boolean> {
    const [hero] = await this.#db
      .select()
      .from(schema.heroes)
      .where(eq(schema.heroes.name, name));
    if (!hero) {
      await this.#db.insert(schema.heroes).values({ name, img });
    }
    return true;
  }
}

export default Turso;
