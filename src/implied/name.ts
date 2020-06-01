import { DefaultTreeElement } from "parse5";

import { impliedTextContent } from "../helpers/textContent";
import { isElement } from "../helpers/nodeMatchers";
import { getClassNames, getAttributeIfTag } from "../helpers/attributes";
import { ParsingOptions } from "../types";

const parseNode = (node: DefaultTreeElement): string | undefined =>
  getAttributeIfTag(node, ["img", "area"], "alt") ??
  getAttributeIfTag(node, ["abbr"], "title");

const parseChild = (node: DefaultTreeElement): string | undefined => {
  const children = node.childNodes.filter(isElement);
  return children.length ? parseNode(children[0]) : undefined;
};

const parseGrandchild = (node: DefaultTreeElement): string | undefined => {
  const children = node.childNodes.filter(isElement);
  return children.length === 1 ? parseChild(children[0]) : undefined;
};

export const impliedName = (
  node: DefaultTreeElement,
  children: DefaultTreeElement[],
  options: ParsingOptions
): string | undefined => {
  if (children.some((child) => getClassNames(child, /^(p|e|h)-/).length)) {
    return;
  }

  return (
    parseNode(node) ??
    parseChild(node) ??
    parseGrandchild(node) ??
    impliedTextContent(node, options)
  );
};
