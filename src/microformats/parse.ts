import {
  MicroformatRoot,
  PropertyType,
  ParsingOptions,
  Element,
} from "../types";
import { microformatProperties } from "./properties";
import { findAuthor } from "../helpers/authorship";
import { textContent } from "../helpers/textContent";
import { getAttributeValue, getClassNames } from "../helpers/attributes";
import { findChildren } from "../helpers/findChildren";
import {
  isMicroformatChild,
  isMicroformatV2Root,
} from "../helpers/nodeMatchers";
import {
  convertV1RootClassNames,
  getBackcompatRootClassNames,
  BackcompatRoot,
} from "../backcompat";
import { applyIncludesToRoot } from "../helpers/includes";
import { parseE } from "./property";
import { isEnabled } from "../helpers/experimental";

interface ParseMicroformatOptions extends ParsingOptions {
  valueType?: PropertyType;
  valueKey?: string;
}

const getMicroformatType = (node: Element): string[] => {
  const v2 = getClassNames(node, "h-");
  return v2.length ? v2 : convertV1RootClassNames(node);
};

const getRoots = (node: Element): BackcompatRoot[] =>
  isMicroformatV2Root(node) ? [] : getBackcompatRootClassNames(node);

const getId = (node: Element): string | undefined =>
  isMicroformatV2Root(node) ? getAttributeValue(node, "id") : undefined;

export const parseMicroformat = (
  node: Element,
  options: ParseMicroformatOptions,
): MicroformatRoot => {
  applyIncludesToRoot(node, options);

  const roots = getRoots(node);
  const id = getId(node);
  const lang = getAttributeValue(node, "lang") || options.inherited.lang;
  const children = findChildren(node, isMicroformatChild);
  const inherited = { lang, roots };

  const item: MicroformatRoot = {
    type: getMicroformatType(node).sort(),
    properties: microformatProperties(node, {
      ...options,
      implyProperties: !children.length,
      inherited,
    }),
  };

  if (id) {
    item.id = id;
  }

  if (isEnabled(options, "lang") && lang) {
    item.lang = lang;
  }

  if (isEnabled(options, "authorship")) {
    const author = findAuthor(item, options.rels);

    if (author) {
      item.properties.author = [author];
    }
  }

  if (children.length) {
    item.children = children.map((child) =>
      parseMicroformat(child, { ...options, inherited }),
    );
  }

  if (options.valueType === "p") {
    item.value =
      (item.properties.name && item.properties.name[0]) ??
      getAttributeValue(node, "title") ??
      textContent(node, options);
  }

  if (options.valueType === "u") {
    item.value =
      (item.properties.url && item.properties.url[0]) ??
      textContent(node, options);
  }

  /**
   * There is some ambiguity on how this should be handled.
   * At the moment, we're following other parsers and keeping `value` a string
   * and adding `html` as an undocumented property.
   */
  if (options.valueType === "e") {
    return { ...parseE(node, options), ...item };
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
