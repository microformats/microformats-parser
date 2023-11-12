import { parse } from "parse5";

import { findChildren } from "./helpers/findChildren";
import { parseMicroformat } from "./microformats/parse";
import { isMicroformatRoot } from "./helpers/nodeMatchers";
import { ParsedDocument, ParserOptions, ParsingOptions } from "./types";
import { validateParsedHtml } from "./validator";
import { documentSetup } from "./helpers/documentSetup";
import { parseMetaformats } from "./helpers/metaformats";
import { isEnabled } from "./helpers/experimental";

export const parser = (
  html: string,
  options: ParserOptions,
): ParsedDocument => {
  const doc = parse(html);
  validateParsedHtml(doc);

  const { idRefs, rels, relUrls, baseUrl, lang } = documentSetup(doc, options);

  const parsingOptions: ParsingOptions = {
    ...options,
    baseUrl,
    idRefs,
    inherited: { roots: [], lang },
    rels,
  };
  let items = findChildren(doc, isMicroformatRoot).map((mf) =>
    parseMicroformat(mf, parsingOptions),
  );

  if (items.length === 0 && isEnabled(parsingOptions, "metaformats")) {
    items = parseMetaformats(doc, parsingOptions);
  }

  return {
    rels,
    "rel-urls": relUrls,
    items,
  };
};
