interface Scenario {
  name: string;
  input: string;
  expected: string;
}

declare function loadScenarios(dir: string): Scenario[];

export = loadScenarios;
