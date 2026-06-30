import { parse } from "parse5";

import { findChildren } from "./helpers/findChildren.js";
import { parseMicroformat } from "./microformats/parse.js";
import { isMicroformatRoot } from "./helpers/nodeMatchers.js";
import { ParsedDocument, ParserOptions, ParsingOptions } from "./types.js";
import { validateParsedHtml } from "./validator.js";
import { documentSetup } from "./helpers/documentSetup.js";
import { parseMetaformats } from "./helpers/metaformats.js";
import { isEnabled } from "./helpers/experimental.js";

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
