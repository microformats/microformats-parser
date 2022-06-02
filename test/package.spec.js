import { expect } from "chai";
import path from "path";
import { fileURLToPath } from "url";

import pkg from "../package.json";
import { loadScenarios } from "./utils/loadScenarios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get the correct module value from package.json and test that
const { mf2 } = await import(`${path.resolve(__dirname, "../", pkg.module)}`);

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

describe("package // esm // scenarios", () => {
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
