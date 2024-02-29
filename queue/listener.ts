import { getHtml } from "../utils/html.ts";
import { getDocument } from "../utils/document.ts";
import { isGetDocumentMessage } from "./interfaces.ts";
import { sendMessage } from "../api/discord.ts";
import { parseHeroStats } from "../utils/parser.ts";
import { cacheHero } from "./utils/cache_hero.ts";

// Get a reference to a KV database
const kv = await Deno.openKv();

// Register a handler function to listen for values - this example shows
// how you might send a notification
kv.listenQueue(async (msg: unknown) => {
  console.log("hello folks");
  // Use type guard - then TypeScript compiler knows msg is a Notification
  if (isGetDocumentMessage(msg)) {
    if (msg.cacheType === "hero") {
      await cacheHero(msg, kv);
    }
  } else {
    // If the message is of an unknown type, it might be an error
    console.error("Unknown message received:", msg);
  }
});
