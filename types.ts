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

interface Field {
  value: string;
  name: string;
}

interface Embed {
  title: string;
  color: number;
  fields: Field[];
  description: string;
  url: string;
  thumbnail: {
    url: string;
  };
  footer: {
    text: string;
  };
}
export interface CommandResponse {
  type: number;
  data: {
    content: string;
    embeds?: Embed[];
  };
}

export interface Command {
  execute(
    // deno-lint-ignore no-explicit-any
    request: any,
    payload: CommonPayload,
  ): Promise<CommandResponse> | CommandResponse;
}

export interface CommonPayload {
  channel: {
    name: string;
    id: string;
  };
  member: {
    user: {
      avatar: string;
      global_name: string;
      username: string;
      id: string;
    };
  };
  token: string;
  type: number;
}
