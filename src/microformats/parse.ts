import {
  MicroformatRoot,
  ParentNode,
  PropertyType,
  ParsingOptions,
} from "../types";
import { microformatProperties } from "./properties";
import { textContent } from "../helpers/textContent";
import { getAttributeValue, getClassNames } from "../helpers/attributes";
import { findChildren } from "../helpers/findChildren";
import {
  isMicroformatChild,
  isMicroformatV2Root,
  isParentNode,
} from "../helpers/nodeMatchers";
import {
  convertV1RootClassNames,
  getBackcompatRootClassNames,
  BackcompatRoot,
} from "../backcompat";
import { applyIncludesToRoot } from "../helpers/includes";
import { parseE } from "./property";

interface ParseMicroformatOptions extends ParsingOptions {
  valueType?: PropertyType;
  valueKey?: string;
}

const getMicroformatType = (node: ParentNode): string[] => {
  const v2 = getClassNames(node, "h-");
  return v2.length ? v2 : convertV1RootClassNames(node);
};

const getRoots = (node: ParentNode): BackcompatRoot[] =>
  isMicroformatV2Root(node) ? [] : getBackcompatRootClassNames(node);

const getId = (node: ParentNode): string | undefined =>
  isMicroformatV2Root(node) ? getAttributeValue(node, "id") : undefined;

const getLanguage = (node: ParentNode): string | undefined => {
  const lang = getAttributeValue(node, "lang");

  if (lang) {
    return lang;
  } else if (node.parentNode && isParentNode(node.parentNode)) {
    return getLanguage(node.parentNode);
  }

  return undefined;
};

export const parseMicroformat = (
  node: ParentNode,
  options: ParseMicroformatOptions
): MicroformatRoot => {
  applyIncludesToRoot(node, options);

  const roots = getRoots(node);
  const id = getId(node);
  const lang = getLanguage(node);
  const children = findChildren(node, isMicroformatChild, options);

  const item: MicroformatRoot = {
    type: getMicroformatType(node).sort(),
    properties: microformatProperties(node, {
      ...options,
      implyProperties: !children.length,
      roots,
    }),
  };

  if (id) {
    item.id = id;
  }

  if (lang && options.experimental?.lang) {
    item.lang = lang;
  }

  if (children.length) {
    item.children = children.map((child) => parseMicroformat(child, options));
  }

  if (options.valueType === "p") {
    item.value =
      (item.properties.name && item.properties.name[0]) ??
      getAttributeValue(node, "title") ??
      textContent(node);
  }

  if (options.valueType === "u") {
    item.value =
      (item.properties.url && item.properties.url[0]) ?? textContent(node);
  }

  /**
   * There is some ambigutity on how this should be handled.
   * At the moment, we're following other parsers and keeping `value` a string
   * and adding `html` as an undocumented property.
   */
  if (options.valueType === "e") {
    return { ...parseE(node), ...item };
  }

  if (options.valueKey && !item.value) {
    /**
     * There's a lot of complexity and ambiguity on how this case should be handled.
     * We should fall back to the `value` property of the nested MicroformatRoot or Image
     */
    const value =
      item.properties[options.valueKey] && item.properties[options.valueKey][0];

    if (value) {
      item.value = typeof value === "string" ? value : value.value;
    }
  }

  return item;
};
