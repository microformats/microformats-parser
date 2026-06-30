import { Backcompat } from "../types.js";

export const vevent: Backcompat = {
  type: ["h-event"],
  properties: {
    summary: "p-name",
    dtstart: "dt-start",
    dtend: "dt-end",
    duration: "dt-duration",
    description: "p-description",
    attendee: "p-attendee",
    location: "p-location",
    url: "u-url",
  },
};
