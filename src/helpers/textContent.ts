import { DefaultTreeNode, DefaultTreeElement } from "parse5";

import { getAttributeValue } from "./attributes";
import { isElement, isTextNode } from "./nodeMatchers";
import { ParserOptions } from "../types";
import { isEnabled } from "./experimental";

const walk = (current: string, node: DefaultTreeNode): string => {
  /* istanbul ignore else */
  if (isElement(node)) {
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

const impliedWalk = (current: string, node: DefaultTreeNode): string => {
  /* istanbul ignore else */
  if (isElement(node)) {
    if (["style", "script"].includes(node.tagName)) {
      return current;
    }

    if (node.tagName === "img") {
      const value = getAttributeValue(node, "alt") || "";
      return `${current}${value}`;
    }

    return node.childNodes.reduce<string>(impliedWalk, current);
  } else if (isTextNode(node)) {
    return `${current}${node.value}`;
  }

  /* istanbul ignore next */
  return current;
};

const experimentalTextContent = (node: DefaultTreeElement): string =>
  node.childNodes.reduce<string>(walk, "").replace(/\s+/g, " ").trim();

export const textContent = (
  node: DefaultTreeElement,
  options: ParserOptions
): string => {
  if (isEnabled(options, "collapseWhitespace")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(walk, "").trim();
};

export const impliedTextContent = (
  node: DefaultTreeElement,
  options: ParserOptions
): string => {
  if (isEnabled(options, "collapseWhitespace")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(impliedWalk, "").trim();
};

export const relTextContent = (
  node: DefaultTreeElement,
  options: ParserOptions
): string => {
  if (isEnabled(options, "collapseWhitespace")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(impliedWalk, "");
};
