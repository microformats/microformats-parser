import { Backcompat } from "../types";

export const adr: Backcompat = {
  type: ["h-adr"],
  properties: {
    "country-name": "p-country-name",
    locality: "p-locality",
    region: "p-region",
    "street-address": "p-street-address",
    "postal-code": "p-postal-code",
    "extended-address": "p-extended-address",
  },
};
