import { GetDocumentMessage, AddUnlistedMessage } from "./interfaces.ts";
const kv = await Deno.openKv();

export async function cacheDocument(msg: GetDocumentMessage) {
  await kv.enqueue(msg);
}

export async function addUnlistedHero(msg: AddUnlistedMessage) {
  await kv.enqueue(msg);
}
