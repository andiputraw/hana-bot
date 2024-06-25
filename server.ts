/// <reference lib="deno.unstable" />
import { load } from "std/dotenv/mod.ts";
await load({ export: true, allowEmptyValues: true });
import { json, serve, validateRequest } from "sift";
import nacl from "nacl";
import { command } from "@/src/mod.ts";
import "@/src/queue/listener.ts";
import { Model } from "@/src/model/mod.ts";
import { Hono } from "hono";
import { log } from "@/src/utils/log.ts";
import { LogType } from "@/src/utils/mod.ts";

await Model.init();
enum InteractionType {
  Ping = 1,
  ApplicationCommand = 2,
  AutoComplete = 4,
}

type Env = {
  Variables: {
    req: any;
  };
};

const app = new Hono<Env>();

// bot validation middleware
app.use("/bot", async (c, next) => {
  const { error } = await validateRequest(c.req.raw, {
    POST: {
      headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
    },
  });

  if (error) {
    return c.json({ error: error.message }, { status: error.status });
  }

  const { valid, body } = await verifySignature(c.req.raw);
  if (!valid) {
    return c.json({ error: "Invalid request" }, { status: 401 });
  }

  const discordRequest = JSON.parse(body);
  c.set("req", discordRequest);

  await next();
});

app.post("/bot", async (c) => {
  const body = c.get("req");
  log(LogType.Info, body);

  const { type = 0, data = { options: [] } } = body;
  if (type == InteractionType.Ping) {
    return c.json({ type: 1 });
  }

  if (type === InteractionType.ApplicationCommand) {
    let commandName = data.name as string;
    if (Deno.env.get("ENV") !== "PRODUCTION") {
      commandName = commandName.replaceAll("dev_", "");
    }
    const comm = command[commandName];
    if (!comm) {
      return c.json({
        type: "4",
        data: {
          content: "sorry. i dont understand your intention",
        },
      });
    }
    const response = await comm.execute(data, body);
    return c.json(response);
  } else if (type === InteractionType.AutoComplete) {
    log(LogType.Info, "Autocomplete");
    let commandName = data.name as string;
    const str = data.options[0].value as string;
    if (Deno.env.get("ENV") !== "PRODUCTION") {
      commandName = commandName.replaceAll("dev_", "");
    }
    const comm = command[commandName];
    if (!comm || !comm.autocomplete) {
      return c.json({
        type: 8,
        data: {
          choices: [],
        },
      });
    }
    const choices = await comm.autocomplete(str);
    console.log(choices);

    return c.json({
      type: 8,
      data: {
        choices: choices.map((choice) => ({
          name: choice,
          value: choice,
        })),
      },
    });
  }
  {
    return c.json({
      type: 4,
      data: {
        content: `Unknown Command Check log lmao`,
      },
    });
  }
});

Deno.serve({ port: 8000 }, app.fetch);

/** Verify whether the request is coming from Discord. */
async function verifySignature(
  request: Request
): Promise<{ valid: boolean; body: string }> {
  const PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
  // Discord sends these headers with every request.
  const signature = request.headers.get("X-Signature-Ed25519")!;
  const timestamp = request.headers.get("X-Signature-Timestamp")!;
  const body = await request.text();
  const valid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature),
    hexToUint8Array(PUBLIC_KEY)
  );

  return { valid, body };
}

/** Converts a hexadecimal string to Uint8Array. */
function hexToUint8Array(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));
}
