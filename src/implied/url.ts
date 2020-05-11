import { ParentNode } from "../types";
import { getClassNames, getAttributeIfTag } from "../helpers/attributes";
import { isParentNode, isMicroformatV2Root } from "../helpers/nodeMatchers";

const parseNode = (node: ParentNode): string | undefined =>
  getAttributeIfTag(node, ["a", "area"], "href");

const parseChildren = (node: ParentNode): string | undefined => {
  const children = node.childNodes.filter(isParentNode);
  const a = children.filter((child) => child.tagName === "a");
  const area = children.filter((child) => child.tagName === "area");

  for (const list of [a, area]) {
    if (list.length === 1 && !isMicroformatV2Root(list[0])) {
      return parseNode(list[0]);
    }
  }

  return;
};

const parseChildsChildren = (node: ParentNode): string | undefined => {
  const children = node.childNodes.filter(isParentNode);
  return children.length === 1 ? parseChildren(children[0]) : undefined;
};

export const impliedUrl = (
  node: ParentNode,
  children: ParentNode[]
): string | undefined => {
  if (children.some((child) => getClassNames(child, "u-").length)) {
    return;
  }

  return parseNode(node) ?? parseChildren(node) ?? parseChildsChildren(node);
};
