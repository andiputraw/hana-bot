export const CONSTANT = {
  GUARDIAN_TALES_GUIDE_BASE_URL: "https://guardiantalesguides.com",
  DEBUG: (Deno.env.get("DEBUG") || "true") === "true",
} as const;
