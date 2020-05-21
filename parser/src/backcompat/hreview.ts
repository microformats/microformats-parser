import { Backcompat } from "../types";

export const hreview: Backcompat = {
  type: ["h-review"],
  properties: {
    item: "p-item",
    rating: "p-rating",
    reviewer: "p-author",
    summary: "p-name",
    url: "u-url",
    description: "e-content",
  },
  rels: {
    bookmark: "u-url",
    tag: "p-category",
  },
};
