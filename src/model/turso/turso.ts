import { HeroDB } from "../interface.ts";
import { LibSQLDatabase } from "drizzle/libsql";
import { HeroAbilities, HeroMetadata, HeroStats } from "../types.ts";

import * as schema from "./schema/schema.ts";
import { and, eq, inArray } from "drizzle";
import { Cache } from "cache-ttl";
import { log, LogType } from "@/src/utils/mod.ts";

class Turso implements HeroDB {
  #db: LibSQLDatabase;
  #cache;
  // deno-lint-ignore no-explicit-any
  constructor(db: LibSQLDatabase, cache: Cache<string, any>) {
    this.#db = db;
    this.#cache = cache;
  }
  async getUnlistedHero(names: string[]): Promise<string[]> {
    const res = await this.#db
      .select()
      .from(schema.heroes)
      .where(inArray(schema.heroes.name, names));

    const listed = res.map((v) => v.name);

    return names.filter((name) => !listed.includes(name));
  }

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
    const heroes = await this.#db
      .select()
      .from(schema.heroes)
      .innerJoin(schema.heroData, eq(schema.heroes.id, schema.heroData.hero_id))
      .where(eq(schema.heroes.name, name));
    if (!heroes[0]) {
      // deno-lint-ignore no-explicit-any
      return [undefined as any, false];
    }
    const hero = heroes[0];

    const [stats] = heroes.filter(
      (v) => v.hero_datas.type === schema.HeroDataType.Stats
    );

    const [abilities] = heroes.filter(
      (v) => v.hero_datas.type === schema.HeroDataType.Abilities
    );

    const [metadatas] = heroes.filter(
      (v) => v.hero_datas.type === schema.HeroDataType.Metadata
    );
    return [
      {
        stats: stats.hero_datas.value as HeroStats,
        abilities: abilities.hero_datas.value as HeroAbilities,
        metadatas: metadatas.hero_datas.value as HeroMetadata,
        img: hero.heroes.img,
      },
      true,
    ];
  }

  async setHero(
    name: string,
    img: string,
    stats: HeroStats,
    abilities: HeroAbilities,
    metadatas: HeroMetadata
  ): Promise<boolean> {
    const [hero] = await this.#db
      .select()
      .from(schema.heroes)
      .where(eq(schema.heroes.name, name));

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

  async getHeroList(): Promise<
    [(typeof schema.heroes.$inferSelect)[], boolean]
  > {
    if (this.#cache.has("heroList")) {
      log(LogType.Runtime, 'cache hit "heroList"');
      return [this.#cache.get("heroList"), true];
    }

    const heroes = await this.#db.select().from(schema.heroes);

    this.#cache.set("heroList", heroes, { ttl: 1000 * 60 * 60 });

    return [heroes, true];
  }

  async #setSomething<V, T>(
    id: number,
    val: any,
    type: schema.HeroDataType
  ): Promise<boolean> {
    const [value] = await this.#db
      .select()
      .from(schema.heroData)
      .where(
        and(eq(schema.heroData.hero_id, id), eq(schema.heroData.type, type))
      );
    if (value) {
      await this.#db
        .update(schema.heroData)
        .set({ value: val })
        .where(
          and(eq(schema.heroData.hero_id, id), eq(schema.heroData.type, type))
        );
    } else {
      await this.#db
        .update(schema.heroData)
        .set({ value: val })
        .where(
          and(eq(schema.heroData.hero_id, id), eq(schema.heroData.type, type))
        );
    }
    return true;
  }

  async setHeroStats(name: string, stats: HeroStats): Promise<boolean> {
    const [hero] = await this.#db
      .select()
      .from(schema.heroes)
      .where(eq(schema.heroes.name, name));
    if (!hero) {
      return false;
    }
    this.#setSomething(hero.id, stats, schema.HeroDataType.Stats);
    return true;
  }

  async setHeroAbilities(
    name: string,
    abilities: HeroAbilities
  ): Promise<boolean> {
    const [hero] = await this.#db
      .select()
      .from(schema.heroes)
      .where(eq(schema.heroes.name, name));
    if (!hero) {
      return false;
    }
    this.#setSomething(hero.id, abilities, schema.HeroDataType.Abilities);
    return true;
  }

  async setHeroMetadatas(
    name: string,
    metadatas: HeroMetadata
  ): Promise<boolean> {
    const [hero] = await this.#db
      .select()
      .from(schema.heroes)
      .where(eq(schema.heroes.name, name));
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
