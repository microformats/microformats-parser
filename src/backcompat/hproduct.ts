import { Backcompat } from "../types";

export const hproduct: Backcompat = {
  type: ["h-product"],
  properties: {
    price: "p-price",
    description: "p-description",
    fn: "p-name",
    review: "p-review",
    brand: "p-brand",
    url: "u-url",
    photo: "u-photo",
  },
  rels: {
    tag: "p-category",
  },
};
