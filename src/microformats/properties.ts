import {
  ParsedProperty,
  MicroformatProperties,
  ParsingOptions,
  Element,
} from "../types.js";
import { findChildren } from "../helpers/findChildren.js";
import { impliedName } from "../implied/name.js";
import { impliedUrl } from "../implied/url.js";
import {
  isMicroformatV1Property,
  isMicroformatV2Property,
} from "../helpers/nodeMatchers.js";
import { impliedPhoto } from "../implied/photo.js";
import { parseProperty, postParseNode } from "./property.js";
import { flatten } from "../helpers/array.js";

const addProperty = (
  properties: MicroformatProperties,
  { key, value }: Pick<ParsedProperty, "key" | "value">,
): void => {
  if (typeof value === "undefined") {
    return;
  }

  if (!properties[key] && !Array.isArray(properties[key])) {
    properties[key] = [value];
    return;
  }

  properties[key].push(value);
};

const getPropertyNodes = (node: Element, options: ParsingOptions): Element[] =>
  !options.inherited.roots.length
    ? findChildren(node, isMicroformatV2Property)
    : findChildren(node, isMicroformatV1Property);

export const microformatProperties = (
  node: Element,
  options: ParsingOptions,
): MicroformatProperties => {
  const properties: MicroformatProperties = {};

  const propertyNodes = getPropertyNodes(node, options);

  propertyNodes
    .map((child) => parseProperty(child, options))
    .reduce(flatten, [])
    .map(postParseNode)
    .forEach((prop) => addProperty(properties, prop));

  if (options.implyProperties && !options.inherited.roots.length) {
    if (typeof properties.name === "undefined") {
      addProperty(properties, {
        key: "name",
        value: impliedName(node, propertyNodes, options),
      });
    }

    if (typeof properties.url === "undefined") {
      addProperty(properties, {
        key: "url",
        value: impliedUrl(node, propertyNodes),
      });
    }

    if (typeof properties.photo === "undefined") {
      addProperty(properties, {
        key: "photo",
        value: impliedPhoto(node, propertyNodes),
      });
    }
  }

  return properties;
};
