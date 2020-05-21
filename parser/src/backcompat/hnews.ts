import { Backcompat } from "../types";

export const hnews: Backcompat = {
  type: ["h-news"],
  properties: {
    entry: "p-entry",
    "source-org": "p-source-org",
    dateline: "p-dateline",
    geo: "p-geo",
  },
  rels: {
    principles: "u-principles",
  },
};
