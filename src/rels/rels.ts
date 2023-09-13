import { Element } from "parse5";

import { Rels, RelUrls, ParserOptions } from "../types";
import { getAttributeValue } from "../helpers/attributes";
import { relTextContent } from "../helpers/textContent";

interface ParseRelOptions {
  rels: Rels;
  relUrls: RelUrls;
}

export const parseRel = (
  child: Element,
  { rels, relUrls }: ParseRelOptions,
  options: ParserOptions,
): void => {
  /**
   * Ignores used as this method is only ever called if they are defined
   * But required for TS typechecking
   */
  const text = relTextContent(child, options);
  const rel = getAttributeValue(child, "rel");
  const href = getAttributeValue(child, "href")?.trim();
  const title = getAttributeValue(child, "title");
  const media = getAttributeValue(child, "media");
  const hreflang = getAttributeValue(child, "hreflang");
  const type = getAttributeValue(child, "type");

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
      relUrls[href].rels.sort();
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
