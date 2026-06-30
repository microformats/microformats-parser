import { Element } from "../types.js";

import { getAttributeValue } from "./attributes.js";
import { Image, ParsingOptions } from "../types.js";

export const parseImage = (
  node: Element,
  { inherited }: Partial<ParsingOptions> = {},
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
