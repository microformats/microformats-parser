import { Element } from "../types";
import { adr } from "./adr";
import { geo } from "./geo";
import { hentry } from "./hentry";
import { hfeed } from "./hfeed";
import { hnews } from "./hnews";
import { hproduct } from "./hproduct";
import { hreview } from "./hreview";
import { vcard } from "./vcard";
import {
  getClassNameIntersect,
  hasClassNameIntersect,
  getRelIntersect,
  hasRelIntersect,
  getAttributeValue,
  getClassNames,
} from "../helpers/attributes";
import { hreviewAggregate } from "./hreview-aggregate";
import { hresume } from "./hresume";
import { vevent } from "./vevent";
import { item } from "./item";
import { flatten } from "../helpers/array";

export const backcompat = {
  adr,
  geo,
  hentry,
  hfeed,
  hnews,
  hproduct,
  hreview,
  vcard,
  hresume,
  vevent,
  item,
  "hreview-aggregate": hreviewAggregate,
};

export type BackcompatRoot = keyof typeof backcompat;

export const backcompatRoots = Object.keys(backcompat) as BackcompatRoot[];

export const getBackcompatRootClassNames = (node: Element): BackcompatRoot[] =>
  getClassNameIntersect(node, backcompatRoots);

export const convertV1RootClassNames = (node: Element): string[] => {
  const classNames = getBackcompatRootClassNames(node)
    .map((cl) => backcompat[cl].type)
    .reduce(flatten);

  return classNames.length > 1
    ? classNames.filter((cl) => cl !== "h-item")
    : classNames;
};

export const hasBackcompatMicroformatProperty = (
  node: Element,
  roots: BackcompatRoot[],
): boolean =>
  roots.some((root) => {
    const { properties, rels } = backcompat[root];
    return (
      hasClassNameIntersect(node, Object.keys(properties)) ||
      (rels && hasRelIntersect(node, Object.keys(rels)))
    );
  });

export const convertV1PropertyClassNames = (
  node: Element,
  roots: BackcompatRoot[],
): string[] => [
  ...new Set(
    roots
      .map((root) => {
        const { properties, rels } = backcompat[root];

        const classes = getClassNameIntersect(
          node,
          Object.keys(properties),
        ).map((cl) => properties[cl]);

        const relClasses =
          (rels &&
            getRelIntersect(node, Object.keys(rels)).map((cl) => rels[cl])) ||
          [];

        return [...classes, ...relClasses];
      })
      .reduce(flatten),
  ),
];

export const getV1IncludeNames = (node: Element): string[] => {
  const itemref = getAttributeValue(node, "itemref");

  if (itemref) {
    return itemref.split(" ");
  }

  if (getClassNames(node).includes("include")) {
    const hrefAttr = node.tagName === "object" ? "data" : "href";

    const href = getAttributeValue(node, hrefAttr);

    if (href && href.startsWith("#")) {
      return [href.substring(1)];
    }
  }

  const headers = node.tagName === "td" && getAttributeValue(node, "headers");

  if (headers) {
    return [headers];
  }

  return [];
};
