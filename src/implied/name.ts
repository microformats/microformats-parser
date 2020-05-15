import { DefaultTreeElement } from "parse5";

import { impliedTextContent } from "../helpers/textContent";
import { isParentNode } from "../helpers/nodeMatchers";
import { getClassNames, getAttributeIfTag } from "../helpers/attributes";

const parseNode = (node: DefaultTreeElement): string | undefined =>
  getAttributeIfTag(node, ["img", "area"], "alt") ??
  getAttributeIfTag(node, ["abbr"], "title");

const parseChildren = (node: DefaultTreeElement): string | undefined => {
  const children = node.childNodes.filter(isParentNode);
  return children.length ? parseNode(children[0]) : undefined;
};

const parseChildsChildren = (node: DefaultTreeElement): string | undefined => {
  const children = node.childNodes.filter(isParentNode);
  return children.length === 1 ? parseChildren(children[0]) : undefined;
};

export const impliedName = (
  node: DefaultTreeElement,
  children: DefaultTreeElement[]
): string | undefined => {
  if (children.some((child) => getClassNames(child, /^(p|e|h)-/).length)) {
    return;
  }

  return (
    parseNode(node) ??
    parseChildren(node) ??
    parseChildsChildren(node) ??
    impliedTextContent(node)
  );
};
