import Fuse from "fuse";

/** Perform a search in the input array using the specified pattern.*/
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
