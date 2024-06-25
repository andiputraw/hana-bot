import { Command } from "./types.ts";
import {
  about,
  alias,
  help,
  hero,
  refresh as __refresh,
} from "./command/mod.ts";

export const command: Record<string, Command> = {
  hero,
  alias,
  help,
  about,
  __refresh,
};
