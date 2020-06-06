import { DefaultTreeNode, DefaultTreeElement } from "parse5";

import { getAttributeValue } from "./attributes";
import { isElement, isTextNode } from "./nodeMatchers";
import { ParserOptions } from "../types";
import { isEnabled } from "./experimental";

const imageValue = (node: DefaultTreeElement): string | undefined =>
  getAttributeValue(node, "alt")?.trim() ??
  getAttributeValue(node, "src")?.trim();

const walk = (current: string, node: DefaultTreeNode): string => {
  /* istanbul ignore else */
  if (isElement(node)) {
    if (["style", "script"].includes(node.tagName)) {
      return current;
    }

    if (node.tagName === "img") {
      const value = imageValue(node);

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

const experimentalWalk = (current: string, node: DefaultTreeNode): string => {
  /* istanbul ignore else */
  if (isElement(node)) {
    if (["style", "script"].includes(node.tagName)) {
      return current;
    }

    if (node.tagName === "img") {
      const value = imageValue(node);

      if (value) {
        return `${current} ${value} `;
      }
    }

    if (node.tagName === "br") {
      return `${current}\n`;
    }

    if (node.tagName === "p") {
      return node.childNodes.reduce<string>(experimentalWalk, `${current}\n`);
    }

    return node.childNodes.reduce<string>(experimentalWalk, current);
  } else if (isTextNode(node)) {
    const value = node.value.replace(/[\t\n\r]/g, " ");
    if (value) {
      return `${current}${value}`;
    }
  }

  /* istanbul ignore next */
  return current;
};

const experimentalTextContent = (node: DefaultTreeElement): string =>
  node.childNodes
    .reduce<string>(experimentalWalk, "")
    .replace(/ +/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .trim();

export const textContent = (
  node: DefaultTreeElement,
  options: ParserOptions
): string => {
  if (isEnabled(options, "textContent")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(walk, "").trim();
};

export const impliedTextContent = (
  node: DefaultTreeElement,
  options: ParserOptions
): string => {
  if (isEnabled(options, "textContent")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(impliedWalk, "").trim();
};

export const relTextContent = (
  node: DefaultTreeElement,
  options: ParserOptions
): string => {
  if (isEnabled(options, "textContent")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(impliedWalk, "");
};
