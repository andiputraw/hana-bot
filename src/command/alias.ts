import { Command, CommandResponse, CommonPayload } from "@/types.ts";
import { alias_ } from "@/alias.ts";
import { Embed, Message } from "@/helpers/responses/mod.ts";
import { dump } from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";

export const alias: Command = {
  async execute(
    request: any,
    payload: CommonPayload,
  ): Promise<CommandResponse> {
    let builder = "```yaml\n";
    const aliasYaml = dump(alias_);
    builder += aliasYaml;
    builder += "\n```";
    return new Embed().setTitle("list of alias").setDescription(builder)
      .build();
  },
};
