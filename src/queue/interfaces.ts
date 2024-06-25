import { CacheType } from "../model/mod.ts";
// Define the shape of the object we expect as a message in the queue

export const enum MessageType {
  GetDocument = 1,
  AddUnlisted = 2,
}
export interface HeroCache {
  heroName: string;
}

export function isHeroCache(data: unknown): data is HeroCache {
  return typeof data === "object" && data !== null && "heroName" in data;
}

export interface GetDocumentMessage {
  type: MessageType.GetDocument;
  link: string;
  cacheType: CacheType;
  channelId: string;
  data: unknown;
}

export interface AddUnlistedMessage {
  type: MessageType.AddUnlisted;
  channelId: string;
}

export type Message = GetDocumentMessage | AddUnlistedMessage;
