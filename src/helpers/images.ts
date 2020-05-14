import { getAttributeValue } from "./attributes";
import { Image, ParentNode, ParsingOptions } from "../types";

export const parseImage = (
  node: ParentNode,
  { inherited: parent }: Partial<ParsingOptions> = {}
): Image | string | undefined => {
  if (node.tagName !== "img") {
    return;
  }

  const alt =
    (!parent || !parent.roots || !parent.roots.length) &&
    getAttributeValue(node, "alt");
  const value = getAttributeValue(node, "src");
  return alt ? { alt, value } : value;
};
