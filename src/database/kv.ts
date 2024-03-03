import { Database } from "./interface.ts";

class KV implements Database {
  #kv;
  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }
  // deno-lint-ignore no-explicit-any
  async get<T = any>(key: Deno.KvKey): Promise<[T, boolean]> {
    const result = await this.#kv.get<T>(key);
    if (!result.value) {
      return ["" as T, false];
    }
    return [result.value, true];
  }
  async set<T>(key: Deno.KvKey, value: T): Promise<boolean> {
    const result = await this.#kv.set(key, value);
    return result.ok;
  }
}
export default KV;
