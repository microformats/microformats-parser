import { getAttributeValue } from "./attributes";
import { isElement, isTextNode } from "./nodeMatchers";
import { ParserOptions, Node, Element } from "../types";
import { isEnabled } from "./experimental";

const imageValue = (node: Element): string | undefined =>
  getAttributeValue(node, "alt")?.trim() ??
  getAttributeValue(node, "src")?.trim();

const walk = (current: string, node: Node): string => {
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

  return current;
};

const impliedWalk = (current: string, node: Node): string => {
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

  return current;
};

const experimentalWalk = (current: string, node: Node): string => {
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

  return current;
};

const experimentalTextContent = (node: Element): string =>
  node.childNodes
    .reduce<string>(experimentalWalk, "")
    .replace(/ +/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .trim();

export const textContent = (node: Element, options: ParserOptions): string => {
  if (isEnabled(options, "textContent")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(walk, "").trim();
};

export const impliedTextContent = (
  node: Element,
  options: ParserOptions,
): string => {
  if (isEnabled(options, "textContent")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(impliedWalk, "").trim();
};

export const relTextContent = (
  node: Element,
  options: ParserOptions,
): string => {
  if (isEnabled(options, "textContent")) {
    return experimentalTextContent(node);
  }

  return node.childNodes.reduce<string>(impliedWalk, "");
};
