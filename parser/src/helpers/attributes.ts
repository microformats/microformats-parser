import { Attribute, DefaultTreeElement } from "parse5";

export const getAttribute = (
  node: DefaultTreeElement,
  name: string
): Attribute | undefined => node.attrs.find((attr) => attr.name === name);

export const getAttributeValue = (
  node: DefaultTreeElement,
  name: string
): string | undefined => getAttribute(node, name)?.value;

export const getClassNames = (
  node: DefaultTreeElement,
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
  node: DefaultTreeElement,
  toCompare: T[]
): T[] =>
  getClassNames(node).filter((name: string): name is T =>
    toCompare.includes(name as T)
  );

export const hasClassName = (
  node: DefaultTreeElement,
  className: string
): boolean => getClassNames(node).some((name) => name === className);

export const hasClassNameIntersect = (
  node: DefaultTreeElement,
  toCompare: string[]
): boolean => getClassNames(node).some((name) => toCompare.includes(name));

export const getAttributeIfTag = (
  node: DefaultTreeElement,
  tagNames: string[],
  attr: string
): string | undefined =>
  tagNames.includes(node.tagName) ? getAttributeValue(node, attr) : undefined;

export const hasRelIntersect = (
  node: DefaultTreeElement,
  toCompare: string[]
): boolean =>
  Boolean(
    getAttributeValue(node, "rel")
      ?.split(" ")
      .some((name) => toCompare.includes(name))
  );

export const getRelIntersect = (
  node: DefaultTreeElement,
  toCompare: string[]
): string[] =>
  getAttributeValue(node, "rel")
    ?.split(" ")
    .filter((name) => toCompare.includes(name)) || [];
