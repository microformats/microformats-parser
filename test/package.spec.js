/* eslint-disable @typescript-eslint/no-var-requires */

const { expect } = require("chai");

const { mf2 } = require("../dist");
const loadScenarios = require("./utils/loadScenarios");

const v1 = loadScenarios("microformats-v1");
const v2 = loadScenarios("microformats-v2");
const mixed = loadScenarios("microformats-mixed");

const options = {
  baseUrl: "http://example.com",
};

describe("mf2() // scenarios", () => {
  describe("microformats-v1", () => {
    v1.forEach(({ name, input, expected }) => {
      it(`should correctly parse ${name}`, () => {
        const result = mf2(input, options);
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe("microformats-v2", () => {
    v2.forEach(({ name, input, expected }) => {
      it(`should correctly parse ${name}`, () => {
        const result = mf2(input, options);
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe("microformats-mixed", () => {
    mixed.forEach(({ name, input, expected }) => {
      it(`should correctly parse ${name}`, () => {
        const result = mf2(input, options);
        expect(result).to.deep.equal(expected);
      });
    });
  });
});
