import { DefaultTreeElement } from "parse5";

import { getClassNames, getAttributeIfTag } from "../helpers/attributes";
import { isElement, isMicroformatV2Root } from "../helpers/nodeMatchers";

const parseNode = (node: DefaultTreeElement): string | undefined =>
  getAttributeIfTag(node, ["a", "area"], "href");

const parseChild = (node: DefaultTreeElement): string | undefined => {
  const children = node.childNodes.filter(isElement);
  const a = children.filter((child) => child.tagName === "a");
  const area = children.filter((child) => child.tagName === "area");

  for (const list of [a, area]) {
    if (list.length === 1 && !isMicroformatV2Root(list[0])) {
      return parseNode(list[0]);
    }
  }

  return;
};

const parseGrandchild = (node: DefaultTreeElement): string | undefined => {
  const children = node.childNodes.filter(isElement);
  return children.length === 1 ? parseChild(children[0]) : undefined;
};

export const impliedUrl = (
  node: DefaultTreeElement,
  children: DefaultTreeElement[]
): string | undefined => {
  if (children.some((child) => getClassNames(child, "u-").length)) {
    return;
  }

  return parseNode(node) ?? parseChild(node) ?? parseGrandchild(node);
};
