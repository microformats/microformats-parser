import { Rels, RelUrls, ParentNode } from "../types";
import { getAttributeValue } from "../helpers/attributes";
import { relTextContent } from "../helpers/textContent";

interface ParseRelOptions {
  rels: Rels;
  relUrls: RelUrls;
}

export const parseRel = (
  child: ParentNode,
  { rels, relUrls }: ParseRelOptions
): void => {
  const text = relTextContent(child);
  const rel = getAttributeValue(child, "rel");
  const href = getAttributeValue(child, "href");
  const title = getAttributeValue(child, "title");
  const media = getAttributeValue(child, "media");
  const hreflang = getAttributeValue(child, "hreflang");
  const type = getAttributeValue(child, "type");

  /* istanbul ignore if */
  if (!rel || !href) {
    return;
  }

  rel.split(" ").forEach((rel) => {
    if (!rels[rel]) {
      rels[rel] = [];
    }

    if (!rels[rel].includes(href)) {
      rels[rel].push(href);
    }

    if (!relUrls[href]) {
      relUrls[href] = { rels: [rel], text };
    } else if (!relUrls[href].rels.includes(rel)) {
      relUrls[href].rels.push(rel);
    }

    if (text && !relUrls[href].text) {
      relUrls[href].text = text;
    }

    if (title && !relUrls[href].title) {
      relUrls[href].title = title;
    }

    if (media && !relUrls[href].media) {
      relUrls[href].media = media;
    }

    if (hreflang && !relUrls[href].hreflang) {
      relUrls[href].hreflang = hreflang;
    }

    if (type && !relUrls[href].type) {
      relUrls[href].type = type;
    }
  });
};
