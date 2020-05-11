import { Image, ParentNode } from "../types";
import { parseImage } from "../helpers/images";
import { getAttributeValue, getClassNames } from "../helpers/attributes";
import { isParentNode, isMicroformatV2Root } from "../helpers/nodeMatchers";

const parseNode = (node: ParentNode): Image | string | undefined => {
  if (node.tagName === "img") {
    return parseImage(node);
  }

  if (node.tagName === "object") {
    return getAttributeValue(node, "data");
  }

  return;
};

const parseChildren = (node: ParentNode): Image | string | undefined => {
  const children = node.childNodes.filter(isParentNode);
  const imgs = children.filter((child) => child.tagName === "img");
  const objects = children.filter((child) => child.tagName === "object");

  for (const list of [imgs, objects]) {
    if (list.length === 1 && !isMicroformatV2Root(list[0])) {
      return parseNode(list[0]);
    }
  }

  return;
};

const parseChildsChildren = (node: ParentNode): string | Image | undefined => {
  const children = node.childNodes.filter(isParentNode);
  return children.length === 1 ? parseChildren(children[0]) : undefined;
};

export const impliedPhoto = (
  node: ParentNode,
  children: ParentNode[]
): Image | string | undefined => {
  if (children.some((child) => getClassNames(child, "u-").length)) {
    return;
  }

  return parseNode(node) ?? parseChildren(node) ?? parseChildsChildren(node);
};
