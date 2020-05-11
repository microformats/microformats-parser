import { MixedNode, ParentNode } from "../types";
import { getAttributeValue } from "./attributes";

const isParentNode = (node: MixedNode): node is ParentNode =>
  Boolean(node.hasOwnProperty("tagName") && node.hasOwnProperty("childNodes"));

const walk = (current: string, node: MixedNode): string => {
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
  } else {
    return `${current}${node.value}`;
  }
};

const impliedWalk = (current: string, node: MixedNode): string => {
  if (isParentNode(node)) {
    if (["style", "script"].includes(node.tagName)) {
      return current;
    }

    if (node.tagName === "img") {
      const value = getAttributeValue(node, "alt");
      return `${current}${value}`;
    }

    return node.childNodes.reduce<string>(impliedWalk, current);
  } else {
    return `${current}${node.value}`;
  }
};

export const textContent = (node: ParentNode): string =>
  node.childNodes.reduce<string>(walk, "").trim();

export const impliedTextContent = (node: ParentNode): string =>
  node.childNodes.reduce<string>(impliedWalk, "").trim();

export const relTextContent = (node: ParentNode): string =>
  node.childNodes.reduce<string>(impliedWalk, "");
