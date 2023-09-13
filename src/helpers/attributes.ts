import { Attribute, Element } from "../types";

export const getAttribute = (
  node: Element,
  name: string,
): Attribute | undefined => node.attrs.find((attr) => attr.name === name);

export const getAttributeValue = (
  node: Element,
  name: string,
): string | undefined => getAttribute(node, name)?.value;

export const getClassNames = (
  node: Element,
  matcher?: RegExp | string,
): string[] => {
  const classNames = getAttributeValue(node, "class")?.split(" ") || [];

  return matcher
    ? classNames.filter((name) =>
        typeof matcher === "string"
          ? name.startsWith(matcher)
          : name.match(matcher),
      )
    : classNames;
};

export const getClassNameIntersect = <T extends string>(
  node: Element,
  toCompare: T[],
): T[] =>
  getClassNames(node).filter((name: string): name is T =>
    toCompare.includes(name as T),
  );

export const hasClassName = (node: Element, className: string): boolean =>
  getClassNames(node).some((name) => name === className);

export const hasClassNameIntersect = (
  node: Element,
  toCompare: string[],
): boolean => getClassNames(node).some((name) => toCompare.includes(name));

export const getAttributeIfTag = (
  node: Element,
  tagNames: string[],
  attr: string,
): string | undefined =>
  tagNames.includes(node.tagName) ? getAttributeValue(node, attr) : undefined;

export const hasRelIntersect = (node: Element, toCompare: string[]): boolean =>
  Boolean(
    getAttributeValue(node, "rel")
      ?.split(" ")
      .some((name) => toCompare.includes(name)),
  );

export const getRelIntersect = (node: Element, toCompare: string[]): string[] =>
  getAttributeValue(node, "rel")
    ?.split(" ")
    .filter((name) => toCompare.includes(name)) || [];
