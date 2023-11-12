import {
  Author,
  Image,
  MicroformatProperty,
  MicroformatRoot,
  Rels,
} from "../types";

function getPlainText(values: MicroformatProperty[]): string | null {
  if (values.length === 0) {
    return null;
  }

  const value = values[0] as Author;
  let plainText: string | null;
  if (value.value !== undefined && typeof value.value === "string") {
    plainText = value.value;
  } else if (typeof value === "string") {
    plainText = value;
  } else {
    plainText = null;
  }

  return plainText && plainText.trim();
}

const parseAuthor = (hCard: MicroformatRoot) => {
  // TODO: Figure out how to stop TypeScript complaining about missing `value`
  const result: Author = {};

  if (hCard.properties !== undefined) {
    // Use first (or only) name
    const names = hCard.properties.name as string[];
    if (names?.length > 0) {
      result.name = names[0];
    }

    // Use first (or only) photo
    const photos = hCard.properties.photo as Image[];
    if (photos?.length > 0) {
      const photo = getPlainText(photos);
      if (photo) {
        result.photo = photo;
      }
    }

    // Use first (or only) URL
    const urls = hCard.properties.url as string[];
    if (urls?.length > 0) {
      result.url = urls[0];
    }
  } else if (hCard) {
    if (URL.canParse(String(hCard))) {
      result.url = String(hCard);
    } else {
      result.name = String(hCard);
    }
  }

  return result as Author;
};

const findEntryAuthor = (hEntry: MicroformatRoot) => {
  const values = hEntry.properties.author || [];

  if (Object.keys(values).length === 0) {
    return;
  }

  return parseAuthor(values[0] as MicroformatRoot);
};

const findFeedAuthor = () => false;

export const findAuthor = async (item: MicroformatRoot, rels: Rels) => {
  // 1. If no `h-entry` then there’s no post to find authorship for.
  const itemIsEntry = item.type && item.type[0] === "h-entry";
  if (!itemIsEntry) {
    return false;
  }

  // 2. Parse the `h-entry`
  const entryAuthor = findEntryAuthor(item);
  const feedAuthor = findFeedAuthor(); // TODO

  // 3 & 4. Return author in `h-entry`, else find author in parent `h-feed`
  const author = entryAuthor ? entryAuthor : feedAuthor;

  // 5. Return `author` if `h-card`
  const authorIsCard = author && author.type[0] === "h-card";
  if (authorIsCard) {
    return author;
  }

  // 6. Use `h-card` fetched from rel=author
  const authorPage = author.properties?.url || rels.author;
  if (authorPage) {
    // Fetch `authorPage` and parse result using `parseMicroformat`
    // This is an async function, which would bubble up to the parent function
  }

  // 7. From the parsed `authorPage`, return the first `h-card` that either:
  //    * Has a value for `u-url` (or `u-uid`) that matches the `authorPage` URL
  //    * Has a value for `u-url` that matches a `rel=me` on the `authorPage`

  // 8. Else, no deterministic author can be found
  return author;
};
