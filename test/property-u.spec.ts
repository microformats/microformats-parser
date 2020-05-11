import { expect } from "chai";

import { mf2 } from "../src";

const options = { baseUrl: "http://example.com" };

describe("specification // u-property", () => {
  describe("no url found in property root element", () => {
    it("should use the text content", () => {
      const input = `<div class="h-entry"><div class="u-url h-card"><span class="p-name">microformats</span></div></div>`;
      const expected = {
        items: [
          {
            type: ["h-entry"],
            properties: {
              url: [
                {
                  properties: {
                    name: ["microformats"],
                  },
                  type: ["h-card"],
                  value: "microformats",
                },
              ],
            },
          },
        ],
        rels: {},
        "rel-urls": {},
      };

      expect(mf2(input, options)).to.deep.equal(expected);
    });
  });

  describe("an iframe with src attribute", () => {
    it("should use the src attribute", () => {
      const input = `<div class="h-entry"><iframe class="u-url" src="http://example.com/"></iframe></div>`;
      const expected = {
        items: [
          {
            type: ["h-entry"],
            properties: {
              name: [""],
              url: ["http://example.com/"],
            },
          },
        ],
        rels: {},
        "rel-urls": {},
      };

      expect(mf2(input, options)).to.deep.equal(expected);
    });
  });

  describe("a link with href attribute", () => {
    it("should use the src attribute", () => {
      const input = `<div class="h-entry"><link class="u-url" href="http://example.com/">A link</link></div>`;
      const expected = {
        items: [
          {
            type: ["h-entry"],
            properties: {
              name: ["A link"],
              url: ["http://example.com/"],
            },
          },
        ],
        rels: {},
        "rel-urls": {},
      };

      expect(mf2(input, options)).to.deep.equal(expected);
    });
  });
});
