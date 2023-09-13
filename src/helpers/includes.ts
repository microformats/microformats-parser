import { Element } from "parse5";

import {
  isMicroformatV2Root,
  isElement,
  isMicroformatRoot,
} from "./nodeMatchers";
import { ParsingOptions } from "../types";
import { getV1IncludeNames } from "../backcompat";

const applyIncludes = (node: Element, options: ParsingOptions): void => {
  const includeNames = getV1IncludeNames(node);

  includeNames.forEach((name) => {
    const include = options.idRefs[name];
    if (include) {
      node.childNodes.push(include);
    }
  });

  node.childNodes.forEach(
    (child) =>
      isElement(child) &&
      !isMicroformatRoot(child) &&
      applyIncludes(child, options),
  );
};

export const applyIncludesToRoot = (
  node: Element,
  options: ParsingOptions,
): void => {
  if (isMicroformatV2Root(node)) {
    return;
  }

  applyIncludes(node, options);
};
