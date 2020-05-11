import { Backcompat } from "../types";

export const hreviewAggregate: Backcompat = {
  type: ["h-review-aggregate"],
  properties: {
    rating: "p-rating",
    average: "p-average",
    best: "p-best",
    count: "p-count",
    item: "p-item",
    url: "u-url",
    fn: "p-name",
  },
};
