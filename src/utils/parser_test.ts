import { parseHeroAbilities, parseHeroStats } from "./parser.ts";
import { getDocument } from "./document.ts";
import { assertEquals } from "std/assert/mod.ts";
Deno.test("parse stat test", async (t) => {
  await t.step("parse abilities testing", () => {
    const input = `<div class="info">
    <div class="heading">Special Ability</div>
    <div class="text">
        <h5>Dual Matrix</h5>
        When attacked, increase Def by 30% for 4 seconds.
        When Justice Edge hits, increase Atk by 30% for 4 seconds.</div>
    </div>`;

    const doc = getDocument(input);
    const el = doc?.getElementsByClassName("info");

    if (!el) {
      throw new Error("document failed");
    }
    const result = parseHeroAbilities(el);

    assertEquals(result[0][0], "Special Ability");
  });

  await t.step("parse stat testing", () => {
    const input = `
    <div class="stats">
        <div>
         <label>Name:</label>
          KAI
        </div>
        <div>
          <label>School:</label>
          <em>Light</em>
        </div>
        <div>
          <em>
            <label>Group Buff:</label>
            Normal Atk Damage  / Skill Atk </em>
        </div>
        <div>
          <label>Introduced:</label>
          April 18th, 2023
        </div>
    </div>`;
    const doc = getDocument(input);
    const el = doc?.getElementsByClassName("stats")[0];
    const collection = el?.getElementsByTagName("div");
    if (!el || !collection) {
      throw new Error("test failed");
    }

    const result = parseHeroStats(collection);
    assertEquals(result[0][0], "Name:");
  });
});
