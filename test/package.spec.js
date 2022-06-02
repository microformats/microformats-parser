/* eslint-disable @typescript-eslint/no-var-requires */

import { expect } from "chai";
import path from "path";
import { fileURLToPath } from "url";

import { mf2 } from "../dist/index.esm";
import { loadScenarios } from "./utils/loadScenarios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scenarioDir = path.resolve(
  __dirname,
  `../node_modules/microformat-tests/tests`
);

const v1 = loadScenarios(scenarioDir, "microformats-v1");
const v2 = loadScenarios(scenarioDir, "microformats-v2");
const mixed = loadScenarios(scenarioDir, "microformats-mixed");

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
