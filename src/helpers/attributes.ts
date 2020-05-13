import { ParentNode, Attribute } from "../types";

export const getAttribute = (
  node: ParentNode,
  name: string
): Attribute | undefined => {
  if (node && node.attrs) {
    return node.attrs.find((attr) => attr.name === name);
  }

  return undefined;
};

export const getAttributeValue = (
  node: ParentNode,
  name: string
): string | undefined => getAttribute(node, name)?.value;

export const getClassNames = (
  node: ParentNode,
  matcher?: RegExp | string
): string[] => {
  const classNames = getAttributeValue(node, "class")?.split(" ") || [];

  return matcher
    ? classNames.filter((name) =>
        typeof matcher === "string"
          ? name.startsWith(matcher)
          : name.match(matcher)
      )
    : classNames;
};

export const getClassNameIntersect = <T extends string>(
  node: ParentNode,
  toCompare: T[]
): T[] =>
  getClassNames(node).filter((name: string): name is T =>
    toCompare.includes(name as T)
  );

export const hasClassName = (node: ParentNode, className: string): boolean =>
  getClassNames(node).some((name) => name === className);

export const hasClassNameIntersect = (
  node: ParentNode,
  toCompare: string[]
): boolean => getClassNames(node).some((name) => toCompare.includes(name));

export const getAttributeIfTag = (
  node: ParentNode,
  tagNames: string[],
  attr: string
): string | undefined =>
  tagNames.includes(node.tagName) ? getAttributeValue(node, attr) : undefined;

export const hasRelIntersect = (
  node: ParentNode,
  toCompare: string[]
): boolean =>
  Boolean(
    getAttributeValue(node, "rel")
      ?.split(" ")
      .some((name) => toCompare.includes(name))
  );

export const getRelIntersect = (
  node: ParentNode,
  toCompare: string[]
): string[] =>
  getAttributeValue(node, "rel")
    ?.split(" ")
    .filter((name) => toCompare.includes(name)) || [];
