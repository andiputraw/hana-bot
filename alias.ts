export const alias_: Record<string, Array<string>> = {
  "future knight - rifle": ["fk", "future knight"],
  "plague doctor": ["pd", "plague doctor"],
};

export function getAlias(alias: string): string | undefined {
  for (const [key, value] of Object.entries(alias_)) {
    const result = value.find((v) => v === alias);
    if (result) {
      return key;
    }
  }
  return undefined;
}
