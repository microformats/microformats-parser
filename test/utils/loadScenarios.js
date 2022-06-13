import glob from "glob";
import path from "path";
import { readFileSync } from "fs";

export const loadScenarios = (baseDir, dir) => {
  const scenarios = glob
    .sync(`${baseDir}/${dir}/**/*.json`)
    .map((testFile) => path.relative(path.join(baseDir, dir), testFile))
    .map((testFile) => testFile.replace(".json", ""))
    .map((name) => {
      const inputPath = path.resolve(baseDir, dir, `${name}.html`);
      const expectedPath = path.resolve(baseDir, dir, `${name}.json`);

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
