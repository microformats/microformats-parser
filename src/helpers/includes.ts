import {
  isMicroformatV2Root,
  isParentNode,
  isMicroformatRoot,
} from "./nodeMatchers";
import { ParentNode, ParsingOptions } from "../types";
import { getV1IncludeNames } from "../backcompat";

const applyIncludes = (node: ParentNode, options: ParsingOptions): void => {
  const includeNames = getV1IncludeNames(node);

  includeNames.forEach((name) => {
    const include = options.idRefs[name];
    if (include) {
      node.childNodes.push(include);
    }
  });

  node.childNodes.forEach(
    (child) =>
      isParentNode(child) &&
      !isMicroformatRoot(child) &&
      applyIncludes(child, options)
  );
};

export const applyIncludesToRoot = (
  node: ParentNode,
  options: ParsingOptions
): void => {
  if (isMicroformatV2Root(node)) {
    return;
  }

  applyIncludes(node, options);
};
