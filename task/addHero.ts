import { load } from "std/dotenv/mod.ts";
import { Model } from "@/src/model/mod.ts";
import { getDocument, getHtml } from "@/src/utils/mod.ts";

await load({ export: true });

const cont = confirm(
  "This action will add a new hero. Do you want to continue?"
);
if (!cont) {
  Deno.exit(0);
}

await Model.init();
const heroModel = Model.getHero();

const html = await getHtml("https://guardiantalesguides.com/game/guardians");
const doc = getDocument(html || "");

if (!doc) {
  console.log("doc not found");
  Deno.exit(0);
}

const innerContent = doc.getElementById("innerContent");
const els = innerContent?.getElementsByClassName("portrait");
if (!els) {
  console.log("Inner content broken");
  Deno.exit(0);
}

for (const el of els) {
  const imgEl = el.getElementsByTagName("img")[0];
  const nameEl = el.getElementsByClassName("detail")[0];

  const img = imgEl.getAttribute("src") || "";
  const name = nameEl.textContent;
  heroModel.addHero(name, `	https://guardiantalesguides.com${img}`);
}

// const fuseOptions = {
//   // isCaseSensitive: false,
//   // includeScore: false,
//   // shouldSort: true,
//   // includeMatches: false,
//   // findAllMatches: false,
//   // minMatchCharLength: 1,
//   // location: 0,
//   // threshold: 0.6,
//   // distance: 100,
//   // useExtendedSearch: false,
//   // ignoreLocation: false,
//   // ignoreFieldNorm: false,
//   // fieldNormWeight: 1,
//   keys: [
//     "name",
//   ],
// };
// console.time("search");
// const fuse = new Fuse(arr, fuseOptions);

// // Change the pattern
// const searchPattern = "karina";

// const list = fuse.search(searchPattern);
// console.timeEnd("search");
// console.log(list[0]);
