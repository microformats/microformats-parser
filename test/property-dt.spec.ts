import { expect } from "chai";

import { mf2 } from "../src";

describe("specification // dt-property", () => {
  describe("dt-end time without dt-start", () => {
    it("should just return the time", () => {
      const input = `<div class="h-entry"><span class="dt-end"><span class="value">7pm</span></span></div>`;
      const expected = {
        items: [
          {
            type: ["h-entry"],
            properties: {
              name: ["7pm"],
              end: ["19:00"],
            },
          },
        ],
        rels: {},
        "rel-urls": {},
      };

      expect(mf2(input, { baseUrl: "http://example.com" })).to.deep.equal(
        expected
      );
    });
  });
});
