import { DefaultTreeElement } from "parse5";

import { ParsingOptions, IdRefs } from "../types";
import { isMicroformatRoot, isParentNode } from "./nodeMatchers";
import { BackcompatRoot, getBackcompatRootClassNames } from "../backcompat";

type Matcher =
  | ((node: DefaultTreeElement) => boolean)
  | ((node: DefaultTreeElement, roots: BackcompatRoot[]) => boolean);

interface ReducerOptions {
  matcher: Matcher;
  roots: BackcompatRoot[];
  idRefs: IdRefs;
}

const getNodeChildren = (node: DefaultTreeElement): DefaultTreeElement[] =>
  node.childNodes.filter(Boolean).filter(isParentNode);

const reducer = (
  microformats: DefaultTreeElement[],
  node: DefaultTreeElement,
  options: ReducerOptions
): DefaultTreeElement[] => {
  const { matcher, roots } = options;
  const match = matcher(node, roots) && node;

  // if we have a match and it's a h- element, stop looking
  if (match && isMicroformatRoot(node)) {
    return [...microformats, node];
  }

  if (isMicroformatRoot(node)) {
    return microformats;
  }

  const childMicroformats = getNodeChildren(node).reduce<DefaultTreeElement[]>(
    (prev, curr) => reducer(prev, curr, options),
    match ? [match] : []
  );

  return [...microformats, ...childMicroformats];
};

export const findChildren = (
  parent: DefaultTreeElement,
  matcher: Matcher,
  options: Pick<ParsingOptions, "idRefs"> = { idRefs: {} }
): DefaultTreeElement[] => {
  const findOptions = {
    ...options,
    roots: isParentNode(parent) ? getBackcompatRootClassNames(parent) : [],
    stopAtRoot: true,
    matcher,
  };

  return getNodeChildren(parent).reduce<DefaultTreeElement[]>(
    (prev, curr) => reducer(prev, curr, findOptions),
    []
  );
};
