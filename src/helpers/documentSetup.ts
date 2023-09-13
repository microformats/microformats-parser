import { Document, Element } from "parse5";

import { ParserOptions, IdRefs, Rels, RelUrls } from "../types";
import { getAttribute, getAttributeValue } from "./attributes";
import { isLocalLink, applyBaseUrl } from "./url";
import { isElement, isRel, isBase } from "./nodeMatchers";
import { parseRel } from "../rels/rels";

interface DocumentSetupResult {
  idRefs: IdRefs;
  rels: Rels;
  relUrls: RelUrls;
  baseUrl: string;
  lang?: string;
}

export const findBase = (node: Element | Document): string | undefined => {
  for (const child of node.childNodes) {
    if (!isElement(child)) {
      continue;
    }

    if (isBase(child)) {
      return getAttributeValue(child, "href");
    }

    const base = findBase(child);

    if (base) {
      return base;
    }
  }

  return;
};

// this is mutating the object, and will mutate it for everything else :-/

const handleNode = (
  node: Element | Document,
  result: DocumentSetupResult,
  options: ParserOptions,
): void => {
  for (const i in node.childNodes) {
    const child = node.childNodes[i];

    if (!isElement(child)) {
      continue;
    }

    /**
     * Delete <template> tags from the document
     */
    if (child.tagName === "template") {
      delete node.childNodes[i];
    }

    /**
     * Extract 'lang' from the <html> or a <meta> tag
     * Always take the first value found
     */
    if (!result.lang) {
      if (child.tagName === "html") {
        result.lang = getAttributeValue(child, "lang");
      }

      if (
        child.tagName === "meta" &&
        getAttributeValue(child, "http-equiv") === "Content-Language"
      ) {
        result.lang = getAttributeValue(child, "content");
      }
    }

    /**
     * Apply the baseUrl to all [href], [src] and object[data] attributes
     */
    const attrsToApplyBaseUrl =
      child.tagName === "object" ? ["data"] : ["href", "src"];

    attrsToApplyBaseUrl.forEach((attrName) => {
      const attr = getAttribute(child, attrName);

      if (attr && isLocalLink(attr.value)) {
        attr.value = applyBaseUrl(attr.value, result.baseUrl);
      } else if (attr) {
        attr.value = attr.value.trim();
      }
    });

    /**
     * If we have an ID, add this node to the ID reference map
     */
    const id = getAttributeValue(child, "id");

    if (id && !result.idRefs[id]) {
      result.idRefs[id] = child;
    }

    if (isRel(child)) {
      parseRel(child, result, options);
    }

    /**
     * Repeat this process for this node's children
     */
    handleNode(child, result, options);
  }
};

export const documentSetup = (
  node: Document,
  options: ParserOptions,
): DocumentSetupResult => {
  const result = {
    idRefs: {},
    rels: {},
    relUrls: {},
    baseUrl: findBase(node) ?? options.baseUrl,
    lang: undefined,
  };

  handleNode(node, result, options);

  return result;
};
