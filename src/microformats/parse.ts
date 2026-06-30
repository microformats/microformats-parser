import {
  MicroformatRoot,
  PropertyType,
  ParsingOptions,
  Element,
} from "../types.js";
import { microformatProperties } from "./properties.js";
import { textContent } from "../helpers/textContent.js";
import { getAttributeValue, getClassNames } from "../helpers/attributes.js";
import { findChildren } from "../helpers/findChildren.js";
import {
  isMicroformatChild,
  isMicroformatRoot,
  isMicroformatV2Root,
} from "../helpers/nodeMatchers.js";
import {
  convertV1RootClassNames,
  getBackcompatRootClassNames,
  BackcompatRoot,
} from "../backcompat/index.js";
import { applyIncludesToRoot } from "../helpers/includes.js";
import { parseE, parseDt } from "./property.js";
import { isEnabled } from "../helpers/experimental.js";

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
      implyProperties: !findChildren(node, isMicroformatRoot).length,
      inherited,
    }),
  };

  if (id) {
    item.id = id;
  }

  if (isEnabled(options, "lang") && lang) {
    item.lang = lang;
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
   * The `value` is set as per default parsing as nothing else has been added
   * to the spec. A proposal has been made:
   * https://github.com/microformats/microformats2-parsing/issues/71
   */
  if (options.valueType === "dt") {
    item.value = parseDt(node, options);
  }

  /**
   * There is some ambigutity on how this should be handled.
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
