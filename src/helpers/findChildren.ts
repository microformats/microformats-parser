import { Document, Element } from "parse5";

import { isMicroformatRoot, isElement } from "./nodeMatchers";
import { BackcompatRoot, getBackcompatRootClassNames } from "../backcompat";

type Matcher =
  | ((node: Element) => boolean)
  | ((node: Element, roots: BackcompatRoot[]) => boolean);

interface ReducerOptions {
  matcher: Matcher;
  roots: BackcompatRoot[];
}

const getElementChildren = (node: Element | Document): Element[] =>
  node.childNodes.filter(Boolean).filter(isElement);

const reducer = (
  microformats: Element[],
  node: Element,
  options: ReducerOptions,
): Element[] => {
  const { matcher, roots } = options;
  const match = matcher(node, roots) && node;

  // if we have a match and it's a h- element, stop looking
  if (match && isMicroformatRoot(node)) {
    return [...microformats, node];
  }

  if (isMicroformatRoot(node)) {
    return microformats;
  }

  const childMicroformats = getElementChildren(node).reduce<Element[]>(
    (prev, curr) => reducer(prev, curr, options),
    match ? [match] : [],
  );

  return [...microformats, ...childMicroformats];
};

export const findChildren = (
  parent: Element | Document,
  matcher: Matcher,
): Element[] => {
  const findOptions = {
    roots: isElement(parent) ? getBackcompatRootClassNames(parent) : [],
    stopAtRoot: true,
    matcher,
  };

  return getElementChildren(parent).reduce<Element[]>(
    (prev, curr) => reducer(prev, curr, findOptions),
    [],
  );
};
