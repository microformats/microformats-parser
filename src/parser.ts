import { parse } from "parse5";

import { findChildren } from "./helpers/findChildren";
import { parseMicroformat } from "./microformats/parse";
import { isMicroformatRoot } from "./helpers/nodeMatchers";
import { ParsedDocument, ParentNode, ParserOptions } from "./types";
import { validateParsedHtml } from "./validator";
import { documentSetup } from "./helpers/documentSetup";

export const parser = (
  html: string,
  options: ParserOptions
): ParsedDocument => {
  const doc = parse(html) as ParentNode;
  validateParsedHtml(doc);

  const { idRefs, rels, relUrls, baseUrl } = documentSetup(doc, options);

  const parsingOptions = { ...options, baseUrl, roots: [], idRefs };

  return {
    rels,
    "rel-urls": relUrls,
    items: findChildren(doc, isMicroformatRoot, parsingOptions).map((mf) =>
      parseMicroformat(mf, parsingOptions)
    ),
  };
};
