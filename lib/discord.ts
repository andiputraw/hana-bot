// Code adapted from https://github.com/discord/discord-example-app/blob/main/utils.js

export async function discordRequest(
  endpoint: string,
  // deno-lint-ignore no-explicit-any
  options: any
): Promise<Response> {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${Deno.env.get("DISCORD_BOT_TOKEN")}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent": "HanaBot (url soon, 0.0.1)",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    return res;
  }
  // return original response
  return res;
}
