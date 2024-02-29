import { Command } from "../types.ts";
import { alias, help, hero } from "./command/mod.ts";

export const command: Record<string, Command> = {
  hero,
  alias,
  help,
};
