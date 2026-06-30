import { Backcompat } from "../types.js";

export const geo: Backcompat = {
  type: ["h-geo"],
  properties: {
    latitude: "p-latitude",
    longitude: "p-longitude",
  },
};
