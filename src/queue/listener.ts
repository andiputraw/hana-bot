import { isGetDocumentMessage } from "./interfaces.ts";
import { cacheHero } from "./utils/cache_hero.ts";
import { log, LogType } from "../utils/mod.ts";

// Get a reference to a KV database
const kv = await Deno.openKv();

// Register a handler function to listen for values - this example shows
// how you might send a notification
kv.listenQueue(async (msg: unknown) => {
  // Use type guard - then TypeScript compiler knows msg is a Notification
  if (isGetDocumentMessage(msg)) {
    if (msg.cacheType === "hero") {
      await cacheHero(msg, kv);
    }
  } else {
    // If the message is of an unknown type, it might be an error
    log(LogType.Error, "Unknown message received:", msg);
  }
});
