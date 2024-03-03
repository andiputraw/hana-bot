import { DOMParser } from "parser";
import { log, LogType } from "./mod.ts";

export function getDocument(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) {
    log(LogType.Error, "cannot initiate document");
    return undefined;
  }

  return doc;
}
