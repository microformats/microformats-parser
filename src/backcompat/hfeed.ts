import { Backcompat } from "../types.js";

export const hfeed: Backcompat = {
  type: ["h-feed"],
  properties: {
    author: "p-author",
    photo: "u-photo",
    url: "u-url",
  },
  rels: {
    tag: "p-category",
  },
};
