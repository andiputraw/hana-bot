import Cache from "./cache.ts";
import db from "./kv/kv.ts";
import Turso from "./turso/turso.ts";
import { createClient } from "libsql";
import { drizzle } from "drizzle/libsql";
import Hero from "./hero.ts";

export class Model {
  static cache: Cache;
  static hero: Hero;

  static async init() {
    const kv = await Deno.openKv();
    const url = Deno.env.get("DB_URL") || "";
    const token = Deno.env.get("DB_AUTH_TOKEN") || "";
    const tursoClient = createClient({ url: url, authToken: token });
    const options = { logger: false };
    if ((Deno.env.get("DEBUG") || "true") === "true") {
      options.logger = true;
    }
    const client = drizzle(tursoClient, options);
    const turso = new Turso(client);
    this.cache = new Cache(new db(kv));
    this.hero = new Hero(turso);
  }
  static getCache() {
    return this.cache;
  }
  static getHero() {
    return this.hero;
  }
}
