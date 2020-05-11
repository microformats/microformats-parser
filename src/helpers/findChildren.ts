import { ParentNode, ParsingOptions, IdRefs } from "../types";
import { isMicroformatRoot, isParentNode } from "./nodeMatchers";
import { BackcompatRoot, getBackcompatRootClassNames } from "../backcompat";

type Matcher =
  | ((node: ParentNode) => boolean)
  | ((node: ParentNode, roots: BackcompatRoot[]) => boolean);

interface ReducerOptions {
  matcher: Matcher;
  roots: BackcompatRoot[];
  idRefs: IdRefs;
}

const getNodeChildren = (node: ParentNode): ParentNode[] =>
  node.childNodes.filter(Boolean).filter(isParentNode);

const reducer = (
  microformats: ParentNode[],
  node: ParentNode,
  options: ReducerOptions
): ParentNode[] => {
  const { matcher, roots } = options;
  const match = matcher(node, roots) && node;

  // if we have a match and it's a h- element, stop looking
  if (match && isMicroformatRoot(node)) {
    return [...microformats, node];
  }

  if (isMicroformatRoot(node)) {
    return microformats;
  }

  const childMicroformats = getNodeChildren(node).reduce<ParentNode[]>(
    (prev, curr) => reducer(prev, curr, options),
    match ? [match] : []
  );

  return [...microformats, ...childMicroformats];
};

export const findChildren = (
  parent: ParentNode,
  matcher: Matcher,
  options: Pick<ParsingOptions, "idRefs"> = { idRefs: {} }
): ParentNode[] => {
  const findOptions = {
    ...options,
    roots: isParentNode(parent) ? getBackcompatRootClassNames(parent) : [],
    stopAtRoot: true,
    matcher,
  };

  return getNodeChildren(parent).reduce<ParentNode[]>(
    (prev, curr) => reducer(prev, curr, findOptions),
    []
  );
};
