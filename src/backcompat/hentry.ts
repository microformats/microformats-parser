import { Backcompat } from "../types";

export const hentry: Backcompat = {
  type: ["h-entry"],
  properties: {
    author: "p-author",
    "entry-content": "e-content",
    "entry-summary": "p-summary",
    "entry-title": "p-name",
    updated: "dt-updated",
  },
  rels: {
    bookmark: "u-url",
    tag: "p-category",
  },
};
