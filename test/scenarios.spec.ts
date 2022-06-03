import { expect } from "chai";
import * as path from "path";

import { mf2 } from "../src";
import { dirname } from "./utils/dirname";
import { loadScenarios } from "./utils/loadScenarios";

const __dirname = dirname(import.meta.url);

const scenarioDir = path.resolve(
  __dirname,
  `../node_modules/microformat-tests/tests`
);

const suitesDir = path.resolve(__dirname, `./suites`);

const v1 = loadScenarios(scenarioDir, "microformats-v1");
const v2 = loadScenarios(scenarioDir, "microformats-v2");
const mixed = loadScenarios(scenarioDir, "microformats-mixed");
const local = loadScenarios(suitesDir, "local");
const experimental = loadScenarios(suitesDir, "experimental");

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

describe("mf2() // local scenarios", () => {
  local.forEach(({ name, input, expected }) => {
    it(`should correctly parse ${name}`, () => {
      const result = mf2(input, { ...options, experimental: {} });
      expect(result).to.deep.equal(expected);
    });
  });
});

describe("mf2() // experimental scenarios", () => {
  experimental.forEach(({ name, input, expected }) => {
    it(`should correctly parse ${name}`, () => {
      const result = mf2(input, {
        ...options,
        experimental: { lang: true, textContent: true },
      });
      expect(result).to.deep.equal(expected);
    });
  });
});
