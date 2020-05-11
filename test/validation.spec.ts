import { expect } from "chai";

import { mf2 as parser } from "../src";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mf2: (html?: unknown, options?: unknown) => string = parser as any;

describe("validation", () => {
  const options = { baseUrl: "http://example.com" };

  describe("html", () => {
    it("should throw an error if it is not provided", () => {
      expect(() => mf2()).to.throw("Microformats parser: HTML not provided");
      expect(() => mf2(undefined)).to.throw(
        "Microformats parser: HTML not provided"
      );
      expect(() => mf2(undefined, options)).to.throw(
        "Microformats parser: HTML not provided"
      );
    });

    it("should throw an error if it is not a string", () => {
      expect(() => mf2(1)).to.throw(
        "Microformats parser: HTML is not a string"
      );
      expect(() => mf2(1, options)).to.throw(
        "Microformats parser: HTML is not a string"
      );
    });

    it("should throw an error if it is an empty string", () => {
      expect(() => mf2("")).to.throw(
        "Microformats parser: HTML cannot be empty"
      );
      expect(() => mf2("", options)).to.throw(
        "Microformats parser: HTML cannot be empty"
      );
    });

    it("should throw an error if the HTML is malformed", () => {
      expect(() => mf2('<div class="h-card></div>', options)).to.throw(
        "Microformats parser: unable to parse HTML"
      );
    });

    it("should throw an error if the HTML has an empty a <body> tag", () => {
      expect(() =>
        mf2(
          "<!DOCTYPE html><html><head><title>Sample document</title></head><body></body></html>",
          options
        )
      ).to.throw("Microformats parser: unable to parse HTML");
    });
  });

  describe("options", () => {
    const html = "<div></div>";

    it("should throw an error if it is not provided", () => {
      expect(() => mf2(html)).to.throw(
        "Microformats parser: options is not provided"
      );

      expect(() => mf2(html, undefined)).to.throw(
        "Microformats parser: options is not provided"
      );
    });

    it("should throw an error if it is null", () => {
      expect(() => mf2(html, null)).to.throw(
        "Microformats parser: options cannot be null"
      );
    });

    it("should throw an error if it is not an object", () => {
      expect(() => mf2(html, 1)).to.throw(
        "Microformats parser: options is not an object"
      );
    });

    describe("baseUrl", () => {
      it("should throw an error if it is not provided", () => {
        expect(() => mf2(html, {})).to.throw(
          "Microformats parser: baseUrl not provided"
        );

        expect(() => mf2(html, { baseUrl: undefined })).to.throw(
          "Microformats parser: baseUrl not provided"
        );
      });
      it("should throw an error if it is not a string", () => {
        expect(() => mf2(html, { baseUrl: 1 })).to.throw(
          "Microformats parser: baseUrl is not a string"
        );
      });

      it("should throw an error if it is empty", () => {
        expect(() => mf2(html, { baseUrl: "" })).to.throw(
          "Microformats parser: baseUrl cannot be empty"
        );
      });

      it("should throw an error if it is not a valid URL", () => {
        expect(() => mf2(html, { baseUrl: "notavalidurl" })).to.throw(
          "Invalid URL: notavalidurl"
        );
      });
    });
  });
});
