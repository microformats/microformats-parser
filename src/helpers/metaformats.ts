import { Document, Element } from "../types";
import { MicroformatRoot, ParsingOptions } from "../types";
import {
  getAttributeIfTag,
  getAttributeValue,
  hasRelIntersect,
} from "./attributes";
import { isEnabled } from "./experimental";
import { isElement, isTag } from "./nodeMatchers";

/** Special key for title tag in meta collection */
const TITLE_TAG_KEY = "<title>";
const CANONICAL_URL_KEY = "<canonical>";
const MEDIA_TYPES = ["image", "video", "audio"];

interface ComplexMediaMeta {
  value: string;
  alt: string;
}
type MetaTagContent = string | ComplexMediaMeta;

/**
 * Creates a normalized store for meta tags
 */
const initializeMetaContentCollection = (): MetaContentCollection => {
  /**
   * Collection of all relevant meta tag content
   * Since tag order isn't guaranteed, need to collect all value before applying defaults
   */
  const metaContent: Record<string, MetaTagContent[]> = {};

  /**
   * Gets the values of the first property found
   * @param properties Array of properties to look for, preferred item first
   */
  const get = (properties: string[]) => {
    for (const key of properties) {
      if (metaContent[key]) {
        return metaContent[key];
      }
    }
    return;
  };

  /**
   * Stores meta tag values.
   *
   * Includes following normalization rules:
   * - Duplicates are removed from repeated (array) tags
   * - src, url, and secure_url media tags are treated same as base (e.g. og:image:url -> og:image)
   * - Alt text is added as property on last image url
   */
  const set = (key: string, value: string) => {
    // Split tag name to normalize values like "og:video:url"
    const [domain, type, subtype] = key.split(":");

    // Media tags specific parsing
    if (
      (domain === "og" || domain === "twitter") &&
      MEDIA_TYPES.includes(type)
    ) {
      if (subtype === "alt") {
        const existingMedia = metaContent[`${domain}:${type}`];

        if (existingMedia?.length) {
          const last = existingMedia.pop();

          if (typeof last === "string") {
            existingMedia.push({ value: last, alt: value });
          } else if (last) {
            // Found duplicate alt text tag so re-inserting existing
            // last should always be object. if condition added for types
            existingMedia.push(last);
          }
        }

        return; // Stop as alt text is already added
      } else if (["url", "secure_url"].includes(subtype)) {
        // Mutate key to normalize different url values
        // Duplicates will be cleaned up on insertion
        key = `${domain}:${type}`;
      }
    }
    const existing = metaContent[key];

    if (existing) {
      const isDuplicate = existing
        .map((existingValue) =>
          typeof existingValue === "string"
            ? existingValue
            : existingValue.value,
        )
        .some((existingValue) => value === existingValue);

      if (!isDuplicate) {
        metaContent[key].push(value);
      } // Else ignore duplicates
    } else {
      metaContent[key] = [value];
    }
  };

  return {
    metaContent,
    set,
    get,
  };
};

interface MetaContentCollection {
  metaContent: Record<string, MetaTagContent[]>;
  set: (key: string, value: string) => void;
  get: (properties: string[]) => MetaTagContent[] | undefined;
}

const collectMetaTags = (head: Element): MetaContentCollection => {
  const metaTags = initializeMetaContentCollection();

  for (const i in head.childNodes) {
    const child = head.childNodes[i];

    if (!isElement(child)) {
      continue;
    }

    const content = getAttributeIfTag(child, ["meta"], "content");
    if (content) {
      // Tags keys usually use the "name" attribute but open graph uses "property"
      // Consider them separately in case a meta tag uses both
      // e.g. <meta property="og:title" name="author" content="Johnny Complex" >
      const property = getAttributeValue(child, "property");
      if (property) {
        metaTags.set(property, content);
      }

      const name = getAttributeValue(child, "name");
      if (name && name !== property) {
        metaTags.set(name, content);
      }
    } else if (child.tagName === "title" && "value" in child.childNodes[0]) {
      metaTags.set(TITLE_TAG_KEY, child.childNodes[0].value);
    } else if (
      child.tagName === "link" &&
      hasRelIntersect(child, ["canonical"])
    ) {
      const canonicalUrl = getAttributeValue(child, "href");
      if (canonicalUrl) {
        metaTags.set(CANONICAL_URL_KEY, canonicalUrl);
      }
    }
  }
  return metaTags;
};

/**
 * Collect meta content into a microformat object
 * @param metaTags Previously parsed meta tag collection
 * @param options Library parsing options
 */
const combineRoot = (
  metaTags: MetaContentCollection,
  options: ParsingOptions,
): MicroformatRoot[] => {
  const item: MicroformatRoot = { properties: {} };

  if (isEnabled(options, "lang") && options.inherited.lang) {
    item.lang = options.inherited.lang;
  }

  /**
   * Define property on microformat root if values are found
   * @param property Key of microformats property
   * @param value Array of values for the property. Empty and undefined values are not added.
   */
  const setMicroformatProp = (
    property: string,
    value: MetaTagContent[] = [],
  ) => {
    const filteredValue = value.filter(Boolean);
    if (filteredValue.length) {
      item.properties[property] = filteredValue;
    }
  };

  let impliedRootClass = "h-entry";
  const [ogType] = metaTags.get(["og:type"]) ?? [];
  if (ogType && typeof ogType === "string") {
    if (ogType === "profile") {
      impliedRootClass = "h-card";
    } else if (["music", "video"].some((type) => ogType.includes(type))) {
      impliedRootClass = "h-cite";
    } // else h-entry
  }
  item.type = [impliedRootClass];

  setMicroformatProp(
    "name",
    metaTags.get(["og:title", "twitter:title", TITLE_TAG_KEY]),
  );
  setMicroformatProp(
    "summary",
    metaTags.get(["og:description", "twitter:description", "description"]),
  );
  setMicroformatProp("featured", metaTags.get(["og:image", "twitter:image"]));
  setMicroformatProp("video", metaTags.get(["og:video", "twitter:video"]));
  setMicroformatProp("audio", metaTags.get(["og:audio", "twitter:audio"]));
  setMicroformatProp(
    "published",
    metaTags.get(["article:published_time", "date"]),
  );
  setMicroformatProp("updated", metaTags.get(["article:modified_time"]));
  setMicroformatProp("author", metaTags.get(["article:author", "author"]));
  setMicroformatProp("url", metaTags.get(["og:url", CANONICAL_URL_KEY]));

  // Publication properties useful for h-cite
  setMicroformatProp(
    "publication",
    metaTags.get(["og:site_name", "publisher"]),
  );

  if (impliedRootClass === "h-card") {
    setMicroformatProp("given-name", metaTags.get(["profile:first_name"]));
    setMicroformatProp("family-name", metaTags.get(["profile:last_name"]));
  }

  if (Object.keys(item.properties).length === 0) {
    return [];
  }

  return [item];
};

export const parseMetaformats = (
  doc: Document,
  options: ParsingOptions,
): MicroformatRoot[] => {
  // Per validation, html element will always be found
  const html = doc.childNodes.find(isTag("html"));
  const head = html?.childNodes.find(isTag("head"));

  // Per manual testing, head will always be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const metaContent = collectMetaTags(head!);
  return combineRoot(metaContent, options);
};
