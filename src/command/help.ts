import { Command, CommandResponse, CommonPayload } from "../types.ts";
import { Embed } from "../helpers/responses/mod.ts";

interface HelpRequest {
  id: string;
  name: string;
  options?: [
    { command: string; type: number; value: string },
  ];
  type: number;
}

function helpHelp() {
  return new Embed().setTitle("List of command").setDescription(`
    **Usage: "\`help [command?]\`"**

    Print this message or the help from the given command.
    if the command is not given. it will print this message.
  `).addField(
    "List of command",
    `
  \`help [command?]\`: Print this message or the help of the given command.
  \`hero [name]\`: Show description of a hero from guardian tales.
  \`alias\` : show alias to be used for [name] parameter in hero command. 
`,
  ).build();
}

function helpHero() {
  return new Embed().setTitle("Hero").setDescription(`
    **Usage: hero [name]**

    Show description of a hero from guardian tales.
    `).addField(
    "examples",
    `
    \`hero "nari"\`
    \`hero "future princess\`"
    \`hero "fei - ascended\`"
    \`hero "future knight - sword"\``,
  ).build();
}

function helpAlias() {
  return new Embed().setTitle("Alias").setDescription(`
    **Usage: alias**

    show alias that can be used for [name] parameter in hero command.
    `).build();
}

export const help: Command = {
  execute(
    request: HelpRequest,
    _payload: CommonPayload,
  ): CommandResponse {
    const option = request.options;
    if (!option) {
      return helpHelp();
    }

    const command = option[0].value;
    switch (command) {
      case "hero":
        return helpHero();
      case "alias":
        return helpAlias();
      case "help":
        return helpHelp();
      default:
        return helpHelp();
    }
  },
};
