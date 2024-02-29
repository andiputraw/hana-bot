import { Command, CommandResponse, CommonPayload } from "@/types.ts";
import { Embed } from "@/helpers/responses/mod.ts";

export const about: Command = {
  execute(
    _request,
    _payload: CommonPayload,
  ): CommandResponse {
    return new Embed().setTitle("About").setDescription(
      `Hello. umm, i am here to help you to fetch some related document based on your need. feel free to do \`help\` to see what can i do for you`,
    ).addField("github repositories", "https://github.com/andiputraw/hana-bot")
      .addField(
        "dependecies",
        `
- deno
- deno std
- deno-dom
- tweetnacl
- sift
      `,
      )
      .addField(
        "credits",
        `
- guardian tales
- https://guardiantalesguides.com
- deno examples
      `,
      )
      .build();
  },
};
