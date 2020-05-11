import { Backcompat } from "../types";

export const hresume: Backcompat = {
  type: ["h-resume"],
  properties: {
    contact: "p-contact",
    experience: "p-experience",
    summary: "p-summary",
    skill: "p-skill",
    education: "p-education",
    affiliation: "p-affiliation",
  },
};
