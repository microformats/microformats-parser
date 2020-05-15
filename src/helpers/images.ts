import { DefaultTreeElement } from "parse5";

import { getAttributeValue } from "./attributes";
import { Image, ParsingOptions } from "../types";

export const parseImage = (
  node: DefaultTreeElement,
  { inherited }: Partial<ParsingOptions> = {}
): Image | string | undefined => {
  if (node.tagName !== "img") {
    return;
  }

  const alt =
    (!inherited || !inherited.roots || !inherited.roots.length) &&
    getAttributeValue(node, "alt");
  const value = getAttributeValue(node, "src");
  return alt ? { alt, value } : value;
};
