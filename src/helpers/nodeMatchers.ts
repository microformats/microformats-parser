import {
  DefaultTreeTextNode,
  DefaultTreeNode,
  DefaultTreeElement,
} from "parse5";

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

export const isParentNode = (
  node: DefaultTreeNode
): node is DefaultTreeElement => "tagName" in node && "childNodes" in node;

export const isTextNode = (
  node: DefaultTreeNode
): node is DefaultTreeTextNode => "value" in node;

export const isMicroformatV2Root = (node: DefaultTreeElement): boolean =>
  getClassNames(node).some((cl) => cl.match(rootClassRegex));

const isMicroformatV1Root = (node: DefaultTreeElement): boolean =>
  hasClassNameIntersect(node, backcompatRoots);

export const isMicroformatRoot = (node: DefaultTreeElement): boolean =>
  isMicroformatV2Root(node) || isMicroformatV1Root(node);

export const isMicroformatV1Property = (
  node: DefaultTreeElement,
  roots: BackcompatRoot[]
): boolean => hasBackcompatMicroformatProperty(node, roots);

export const isMicroformatV2Property = (node: DefaultTreeElement): boolean =>
  getClassNames(node, propClassRegex).length > 0;

export const isMicroformatChild = (
  node: DefaultTreeElement,
  roots: BackcompatRoot[]
): boolean =>
  !isMicroformatV2Property(node) &&
  !isMicroformatV1Property(node, roots) &&
  isMicroformatRoot(node);

export const isBase = (node: DefaultTreeElement): boolean =>
  Boolean(
    isParentNode(node) && node.tagName === "base" && getAttribute(node, "href")
  );

export const isValueClass = (node: DefaultTreeElement): boolean =>
  isParentNode(node) && hasClassNameIntersect(node, ["value", "value-title"]);

export const isRel = (node: DefaultTreeElement): boolean =>
  Boolean(
    isParentNode(node) &&
      node.attrs.some((attr) => attr.name === "rel") &&
      node.attrs.some((attr) => attr.name === "href")
  );
