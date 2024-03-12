import { assertEquals } from "std/assert/mod.ts";
import { search } from "./search.ts";
Deno.test("Search testing", (t) => {
  const data = [{ name: "karina" }, { name: "marina" }];
  const result = search(data, "kawina");
  assertEquals(result[0].item.name, "karina");
});
