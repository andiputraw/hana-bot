import { Database } from "./interface.ts";
import { CacheType, DocumentType } from "./types.ts";

class Cache {
  #db;
  constructor(db: Database) {
    this.#db = db;
  }

  async setCache(
    type: CacheType,
    name: string,
    docType: DocumentType,
    value: string,
  ) {
    const result = await this.#db.set([type, name, docType], value);
    return result;
  }

  async getCache<T>(
    type: CacheType,
    name: string,
    docType: DocumentType,
  ): Promise<[T, boolean]> {
    return await this.#db.get<T>([type, name, docType]);
  }
}

export default Cache;
