import { expect } from "chai";

import { mf2 } from "../src";

describe("specification // rel-urls", () => {
  describe("with multiple rels", () => {
    it("should take the first non-empty value for name", () => {
      const input = `<link rel="me" href="http://example.com"><a rel="me" href="http://example.com">My name</a><a rel="home" href="http://example.com">Go back home</a>`;
      const expected = {
        rels: {
          me: ["http://example.com"],
          home: ["http://example.com"],
        },
        "rel-urls": {
          "http://example.com": {
            rels: ["me", "home"],
            text: "My name",
          },
        },
        items: [],
      };

      expect(mf2(input, { baseUrl: "http://example.com" })).to.deep.equal(
        expected
      );
    });
  });
});
