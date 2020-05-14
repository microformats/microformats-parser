import { MixedNode, ParentNode } from "../types";
import { getAttributeValue } from "./attributes";
import { isParentNode, isTextNode } from "./nodeMatchers";

const walk = (current: string, node: MixedNode): string => {
  /* istanbul ignore else */
  if (isParentNode(node)) {
    if (["style", "script"].includes(node.tagName)) {
      return current;
    }

    if (node.tagName === "img") {
      const value =
        getAttributeValue(node, "alt") ?? getAttributeValue(node, "src");

      if (value) {
        return `${current} ${value} `;
      }
    }

    return node.childNodes.reduce<string>(walk, current);
  } else if (isTextNode(node)) {
    return `${current}${node.value}`;
  }

  /* istanbul ignore next */
  return current;
};

const impliedWalk = (current: string, node: MixedNode): string => {
  /* istanbul ignore else */
  if (isParentNode(node)) {
    if (["style", "script"].includes(node.tagName)) {
      return current;
    }

    if (node.tagName === "img") {
      const value = getAttributeValue(node, "alt");
      return `${current}${value}`;
    }

    return node.childNodes.reduce<string>(impliedWalk, current);
  } else if (isTextNode(node)) {
    return `${current}${node.value}`;
  }

  /* istanbul ignore next */
  return current;
};

export const textContent = (node: ParentNode): string =>
  node.childNodes.reduce<string>(walk, "").trim();

export const impliedTextContent = (node: ParentNode): string =>
  node.childNodes.reduce<string>(impliedWalk, "").trim();

export const relTextContent = (node: ParentNode): string =>
  node.childNodes.reduce<string>(impliedWalk, "");
