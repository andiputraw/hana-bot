import Cache from "./cache.ts";
import db from "./kv.ts";

const kv = await Deno.openKv();
export const cache = new Cache(new db(kv));
export * from "./cache.ts";
