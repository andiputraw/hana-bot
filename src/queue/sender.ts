import { GetDocumentMessage } from "./interfaces.ts";
const kv = await Deno.openKv();

export async function cacheDocument(msg: GetDocumentMessage) {
  await kv.enqueue(msg);
}
