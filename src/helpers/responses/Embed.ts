import { CommandResponse } from "../../types.ts";

//adapted on https://github.com/discordeno/serverless-deno-deploy-template/blob/main/src/utils/Embed.ts
const embedLimits = {
  title: 256,
  description: 2048,
  fieldName: 256,
  fieldValue: 1024,
  footerText: 2048,
  authorName: 256,
  fields: 25,
  total: 6000,
};

/*{
  "content": "",
  "tts": false,
  "embeds": [
    {
      "id": 652627557,
      "title": " ",
      "color": 2353999,
      "fields": [
        {
          "id": 560329890,
          "name": "a",
          "value": "## **Circle of Life**\nAbsorbs the enemy's life force to deal damage.\nOn the last Circle of Life's hit, shoots a concentrated orb to heal all allies' HP, and reduces the enemy's ranged Def by 20% for 3 seconds.",
          "inline": false
        }
      ],
      "description": "# God of Harvest Kamael",
      "url": "https://guardiantalesguides.com/files/site_images/1/725.png",
      "thumbnail": {
        "url": "https://guardiantalesguides.com/files/site_images/1/725.png"
      }
    }
  ],
  "components": [],
  "actions": {}
} */

export class Embed {
  #content = "";
  #currentTotal = 0;
  #thumbnail = "";
  #description = "";
  #fields: Array<{ name: string; value: string }> = [];
  #title = "";
  #footer = "";
  #url = "";
  constructor() {
  }
  fitData(data: string, max: number) {
    // If the string is bigger then the allowed max shorten it.
    if (data.length > max) data = data.substring(0, max);
    // Check the amount of characters left for this embed
    const availableCharacters = embedLimits.total - this.#currentTotal;
    // If it is maxed out already return empty string as nothing can be added anymore
    if (!availableCharacters) return ``;
    // If the string breaks the maximum embed limit then shorten it.
    if (this.#currentTotal + data.length > embedLimits.total) {
      return data.substring(0, availableCharacters);
    }
    // Return the data as is with no changes.
    return data;
  }
  setContent(content: string) {
    this.#content = content;
    return this;
  }
  setTitle(title: string) {
    this.#title = this.fitData(title, embedLimits.title);
    return this;
  }
  setUrl(url: string) {
    this.#url = url;
    return this;
  }
  setThumbnail(thumb: string) {
    this.#thumbnail = thumb;
    return this;
  }
  setDescription(desc: string) {
    this.#description = this.fitData(desc, embedLimits.description);
    return this;
  }
  addField(name: string, value: string) {
    this.#fields.push({
      name: this.fitData(name, embedLimits.fieldName),
      value: this.fitData(value, embedLimits.fieldValue),
    });
    return this;
  }
  setFooter(text: string) {
    this.#footer = this.fitData(text, embedLimits.footerText);
    return this;
  }
  build(): CommandResponse {
    return {
      data: {
        content: this.#content,
        embeds: [{
          color: 2332651,
          url: this.#url,
          description: this.#description,
          thumbnail: {
            url: this.#thumbnail,
          },
          title: this.#title,
          fields: this.#fields,
          footer: {
            text: this.#footer,
          },
        }],
      },
      type: 4,
    };
  }
}
