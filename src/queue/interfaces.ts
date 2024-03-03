import { CacheType } from "../model/mod.ts";
// Define the shape of the object we expect as a message in the queue

export interface HeroCache {
  heroName: string;
}

export interface GetDocumentMessage {
  link: string;
  cacheType: CacheType;
  channelId: string;
  data: unknown;
}

export function isGetDocumentMessage(obj: any): obj is GetDocumentMessage {
  return (
    typeof obj.link === "string" &&
    typeof obj.cacheType === "string" && // Assuming cacheType is a number
    typeof obj.channelId === "string" &&
    obj.data !== undefined // You may want to add further checks for data
  );
}

export function isHeroCache(obj: any): obj is HeroCache {
  return (
    typeof obj.heroName === "string"
  );
}
