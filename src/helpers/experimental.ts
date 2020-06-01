import { ParsingOptions, ExperimentalOptions } from "../types";

export const isEnabled = (
  options: ParsingOptions | undefined,
  flag: ExperimentalOptions
): boolean => {
  if (!options || !options.experimental) {
    return false;
  }

  return options.experimental[flag] || false;
};
