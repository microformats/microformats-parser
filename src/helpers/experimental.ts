import { ExperimentalName, ParserOptions } from "../types.js";

export const isEnabled = (
  options: ParserOptions,
  flag: ExperimentalName,
): boolean => {
  if (!options || !options.experimental) {
    return false;
  }

  return options.experimental[flag] || false;
};
