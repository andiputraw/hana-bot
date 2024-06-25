import { MessageType, Message } from "./interfaces.ts";
import { cacheHero } from "@/src/queue/utils/cacheHero.ts";
import { addUnlistedHero } from "@/src/queue/utils/addUnlistedHero.ts";
import { log, LogType } from "../utils/mod.ts";

// Get a reference to a KV database
const kv = await Deno.openKv();

// Register a handler function to listen for values - this example shows
// how you might send a notification
kv.listenQueue(async (msg: Message) => {
  // Use type guard - then TypeScript compiler knows msg is a Notification
  switch (msg.type) {
    case MessageType.GetDocument:
      await cacheHero(msg, kv);
      break;
    case MessageType.AddUnlisted:
      await addUnlistedHero(msg);
      break;
    default:
      // If the message is of an unknown type, it might be an error
      log(LogType.Error, "Unknown message received:", msg);
  }
});
