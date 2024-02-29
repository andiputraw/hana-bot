import { CommandResponse } from "@/types.ts";

export class Message {
  #content = "";
  constructor() {
  }
  setContent(content: string) {
    this.#content = content;
    return this;
  }
  build(): CommandResponse {
    return {
      data: {
        content: this.#content,
      },
      type: 4,
    };
  }
}
