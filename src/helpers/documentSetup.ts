import { ParserOptions, ParentNode, IdRefs, Rels, RelUrls } from "../types";
import { getAttribute, getAttributeValue } from "./attributes";
import { isLocalLink, applyBaseUrl } from "./url";
import { isParentNode, isRel, isBase } from "./nodeMatchers";
import { parseRel } from "../rels/rels";

interface DocumentSetupResult {
  idRefs: IdRefs;
  rels: Rels;
  relUrls: RelUrls;
  baseUrl: string;
}

export const findBase = (node: ParentNode): string | undefined => {
  for (const child of node.childNodes) {
    if (!isParentNode(child)) {
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

const handleNode = (node: ParentNode, result: DocumentSetupResult): void => {
  for (const i in node.childNodes) {
    const child = node.childNodes[i];

    if (!isParentNode(child)) {
      continue;
    }

    /**
     * Delete <template> tags from the document
     */
    if (child.tagName === "template") {
      delete node.childNodes[i];
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
      parseRel(child, result);
    }

    /**
     * Repeat this process for this node's children
     */
    handleNode(child, result);
  }
};

export const documentSetup = (
  node: ParentNode,
  options: ParserOptions
): DocumentSetupResult => {
  const result = {
    idRefs: {},
    rels: {},
    relUrls: {},
    baseUrl: findBase(node) ?? options.baseUrl,
  };

  handleNode(node, result);

  return result;
};
