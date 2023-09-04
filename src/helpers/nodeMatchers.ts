import { TextNode, Node, Element } from "parse5";

import {
  getAttribute,
  hasClassNameIntersect,
  getClassNames,
} from "./attributes";
import {
  backcompatRoots,
  hasBackcompatMicroformatProperty,
  BackcompatRoot,
} from "../backcompat";

const classRegex = (prefix: string): RegExp =>
  new RegExp(`^${prefix}-([a-z0-9]+-)?([a-z]+-)*[a-z]+$`);

const rootClassRegex = classRegex("h");
const propClassRegex = classRegex("(p|e|u|dt)");

export const isElement = (node: Node): node is Element =>
  "tagName" in node && "childNodes" in node;

export const isTag =
  (tagName: string) =>
  (node: Node): node is Element =>
    isElement(node) && node.tagName === tagName;

export const isTextNode = (node: Node): node is TextNode => "value" in node;

export const isMicroformatV2Root = (node: Element): boolean =>
  getClassNames(node).some((cl) => cl.match(rootClassRegex));

const isMicroformatV1Root = (node: Element): boolean =>
  hasClassNameIntersect(node, backcompatRoots);

export const isMicroformatRoot = (node: Element): boolean =>
  isMicroformatV2Root(node) || isMicroformatV1Root(node);

export const isMicroformatV1Property = (
  node: Element,
  roots: BackcompatRoot[]
): boolean => hasBackcompatMicroformatProperty(node, roots);

export const isMicroformatV2Property = (node: Element): boolean =>
  getClassNames(node, propClassRegex).length > 0;

export const isMicroformatChild = (
  node: Element,
  roots: BackcompatRoot[]
): boolean =>
  !isMicroformatV2Property(node) &&
  !isMicroformatV1Property(node, roots) &&
  isMicroformatRoot(node);

export const isBase = (node: Element): boolean =>
  Boolean(
    isElement(node) && node.tagName === "base" && getAttribute(node, "href")
  );

export const isValueClass = (node: Element): boolean =>
  isElement(node) && hasClassNameIntersect(node, ["value", "value-title"]);

export const isRel = (node: Element): boolean =>
  Boolean(
    isElement(node) &&
      node.attrs.some((attr) => attr.name === "rel") &&
      node.attrs.some((attr) => attr.name === "href")
  );
