import {
  ParsedProperty,
  MicroformatProperties,
  ParsingOptions,
  Element,
} from "../types";
import { findChildren } from "../helpers/findChildren";
import { impliedName } from "../implied/name";
import { impliedUrl } from "../implied/url";
import {
  isMicroformatV1Property,
  isMicroformatV2Property,
} from "../helpers/nodeMatchers";
import { impliedPhoto } from "../implied/photo";
import { parseProperty, postParseNode } from "./property";
import { flatten } from "../helpers/array";

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
