interface Scenario {
  name: string;
  input: string;
  expected: string;
}

export function loadScenarios(baseDir: string, dir: string): Scenario[];
