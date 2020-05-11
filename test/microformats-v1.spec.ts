import { expect } from "chai";

import { mf2 } from "../src";

describe("specification // microformats-v1", () => {
  describe("includes", () => {
    it("should not include the data the href does not start with #", () => {
      const input = `<div class="vcard"><a class="include" href="not-an-index">Example vard</a></span></div><span id="not-an-index"><span class="fn">Name</span>`;
      const expected = {
        items: [{ properties: {}, type: ["h-card"] }],
        "rel-urls": {},
        rels: {},
      };

      expect(mf2(input, { baseUrl: "http://example.com" })).to.deep.equal(
        expected
      );
    });

    it("should handle a href # not existing", () => {
      const input = `<div class="vcard"><a class="include" href="#does-not-exist">Example vard</a></span></div>`;
      const expected = {
        items: [{ properties: {}, type: ["h-card"] }],
        "rel-urls": {},
        rels: {},
      };

      expect(mf2(input, { baseUrl: "http://example.com" })).to.deep.equal(
        expected
      );
    });
  });
});
