import { DefaultTreeElement } from "parse5";

import { isMicroformatRoot, isElement } from "./nodeMatchers";
import { BackcompatRoot, getBackcompatRootClassNames } from "../backcompat";

type Matcher =
  | ((node: DefaultTreeElement) => boolean)
  | ((node: DefaultTreeElement, roots: BackcompatRoot[]) => boolean);

interface ReducerOptions {
  matcher: Matcher;
  roots: BackcompatRoot[];
}

const getElementChildren = (node: DefaultTreeElement): DefaultTreeElement[] =>
  node.childNodes.filter(Boolean).filter(isElement);

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

  const childMicroformats = getElementChildren(node).reduce<
    DefaultTreeElement[]
  >((prev, curr) => reducer(prev, curr, options), match ? [match] : []);

  return [...microformats, ...childMicroformats];
};

export const findChildren = (
  parent: DefaultTreeElement,
  matcher: Matcher
): DefaultTreeElement[] => {
  const findOptions = {
    roots: isElement(parent) ? getBackcompatRootClassNames(parent) : [],
    stopAtRoot: true,
    matcher,
  };

  return getElementChildren(parent).reduce<DefaultTreeElement[]>(
    (prev, curr) => reducer(prev, curr, findOptions),
    []
  );
};
