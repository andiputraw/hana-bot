import { integer, sqliteTable, text, uniqueIndex } from "drizzle/sqlite-core";
import { HeroAbilities, HeroMetadata, HeroStats } from "../../types.ts";

export const enum HeroDataType {
  Stats,
  Abilities,
  Metadata,
}

export const heroes = sqliteTable("heroes", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  img: text("img").notNull(),
}, (table) => ({
  heros_idx: uniqueIndex("heros_idx").on(table.name),
}));

export const heroData = sqliteTable("hero_datas", {
  id: integer("id").primaryKey(),
  hero_id: integer("hero_id").notNull().references(() => heroes.id),
  type: integer("type").notNull(),
  value: text("value", { mode: "json" }).$type<
    HeroStats | HeroAbilities | HeroMetadata
  >().notNull(),
});
