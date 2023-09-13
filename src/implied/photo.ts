import { Element } from "parse5";

import { Image } from "../types";
import { parseImage } from "../helpers/images";
import { getAttributeValue, getClassNames } from "../helpers/attributes";
import { isElement, isMicroformatV2Root } from "../helpers/nodeMatchers";

const parseNode = (node: Element): Image | string | undefined => {
  if (node.tagName === "img") {
    return parseImage(node);
  }

  if (node.tagName === "object") {
    return getAttributeValue(node, "data");
  }

  return;
};

const parseChild = (node: Element): Image | string | undefined => {
  const children = node.childNodes.filter(isElement);
  const imgs = children.filter((child) => child.tagName === "img");
  const objects = children.filter((child) => child.tagName === "object");

  for (const list of [imgs, objects]) {
    if (list.length === 1 && !isMicroformatV2Root(list[0])) {
      return parseNode(list[0]);
    }
  }

  return;
};

const parseGrandchild = (node: Element): string | Image | undefined => {
  const children = node.childNodes.filter(isElement);
  return children.length === 1 ? parseChild(children[0]) : undefined;
};

export const impliedPhoto = (
  node: Element,
  children: Element[],
): Image | string | undefined => {
  if (children.some((child) => getClassNames(child, "u-").length)) {
    return;
  }

  return parseNode(node) ?? parseChild(node) ?? parseGrandchild(node);
};
