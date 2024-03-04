import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs";

export function search<T>(
  input: T[],
  pattern: string,
): [{ item: T; refIndex: number }] {
  console.time("search");
  const fuseOptions = {
    keys: [
      "name",
    ],
  };
  const fuse = new Fuse(input, fuseOptions);

  const list = fuse.search(pattern);
  console.timeEnd("search");
  return list;
}
