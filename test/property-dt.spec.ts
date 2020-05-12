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

  it("should reorder datetime elements in the value-class-pattern matcher", () => {
    const input = `<div class="h-entry"><span class="dt-published published dt-updated updated"><time class="value" datetime="23:24-0700">23:24</time> on <time class="value">2020-03-20</time></span></div>`;
    const expected = {
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["23:24 on 2020-03-20"],
            published: ["2020-03-20 23:24-0700"],
            updated: ["2020-03-20 23:24-0700"],
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
