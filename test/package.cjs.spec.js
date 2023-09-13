import { expect } from "chai";
import path from "path";
import { readFileSync } from "fs";

import { loadScenarios } from "./utils/loadScenarios";
import { dirname } from "./utils/dirname";

const __dirname = dirname(import.meta.url);
const { main: modulePath } = JSON.parse(
  readFileSync(path.resolve(__dirname, "../package.json"))
);

// get the correct module value from package.json and test that
const { mf2 } = await import(path.resolve(__dirname, "../", modulePath));

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

describe("package // cjs // scenarios", () => {
  it("should have a .cjs extension", () => {
    expect(modulePath).to.match(/\.cjs$/);
  });

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
