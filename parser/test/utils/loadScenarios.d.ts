interface Scenario {
  name: string;
  input: string;
  expected: string;
}

declare function loadScenarios(baseDir: string, dir: string): Scenario[];

export = loadScenarios;
