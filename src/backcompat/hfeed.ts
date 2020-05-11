import { Backcompat } from "../types";

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
