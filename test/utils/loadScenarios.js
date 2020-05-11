/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const glob = require("glob");
const path = require("path");
const { readFileSync } = require("fs");

const scenarioDir = path.resolve(
  __dirname,
  `../../node_modules/microformat-tests/tests`
);

const loadScenarios = (dir) => {
  const scenarios = glob
    .sync(`${scenarioDir}/${dir}/**/*.json`)
    .map((testFile) => path.relative(path.join(scenarioDir, dir), testFile))
    .map((testFile) => testFile.replace(".json", ""))
    .map((name) => {
      const inputPath = path.resolve(scenarioDir, dir, `${name}.html`);
      const expectedPath = path.resolve(scenarioDir, dir, `${name}.json`);

      return {
        name,
        input: readFileSync(inputPath, "utf8"),
        expected: JSON.parse(readFileSync(expectedPath, "utf8")),
      };
    });

  if (!scenarios.length) {
    throw new Error("No scenarios found");
  }

  return scenarios;
};

module.exports = loadScenarios;
