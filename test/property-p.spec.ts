import { expect } from "chai";

import { mf2 } from "../src";

describe("specification // p-property", () => {
  describe("an empty p- property", () => {
    it("should just return an empty property", () => {
      const input = `<div class="h-entry"><span class="p-name"></span></div>`;
      const expected = {
        items: [
          {
            type: ["h-entry"],
            properties: {
              name: [""],
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
