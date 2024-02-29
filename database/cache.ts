import { Database } from "./interface.ts";
export type CacheType = "hero";
export type DocumentType = "info" | "desc" | "thumbnail";
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

// const cacheFolder = "./cache";

// export async function getCache(name: string): Promise<string> {
//   try {
//     const str = await Deno.readFile(`${cacheFolder}/${name}.html`);
//     const decoder = new TextDecoder();
//     return decoder.decode(str);
//   } catch (error) {
//     if (!(error instanceof Deno.errors.NotFound)) {
//       return "";
//     }
//     return "";
//   }
// }

// export async function storeCache(
//   name: string,
//   content: ReadableStream<Uint8Array>,
// ) {
//   using file = await Deno.open(`${cacheFolder}/${name}.html`, {
//     write: true,
//     create: true,
//   });
//   await content.pipeTo(file.writable);
// }
