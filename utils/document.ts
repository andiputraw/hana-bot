import { DOMParser } from "parser";

export function getDocument(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) {
    console.error("cannot initiate document");
    Deno.exit(1);
  }

  return doc;
}
