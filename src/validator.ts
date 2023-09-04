import { Document } from "parse5";

import { isElement, isTag } from "./helpers/nodeMatchers";

const assertIsString = (str: unknown, name: string): string => {
  if (typeof str === "undefined") {
    throw new TypeError(`Microformats parser: ${name} not provided`);
  }

  if (typeof str !== "string") {
    throw new TypeError(`Microformats parser: ${name} is not a string`);
  }

  if (str === "") {
    throw new TypeError(`Microformats parser: ${name} cannot be empty`);
  }

  return str;
};

const assertIsBoolean = (bool: unknown, name: string): boolean => {
  if (typeof bool !== "boolean") {
    throw new TypeError(`Microformats parser: ${name} is not a boolean`);
  }

  return bool;
};

const assertIsObject = (
  obj: unknown,
  allowedKeys: string[],
  name: string
): Record<string, unknown> => {
  if (typeof obj === "undefined") {
    throw new TypeError(`Microformats parser: ${name} is not provided`);
  }

  if (typeof obj !== "object") {
    throw new TypeError(`Microformats parser: ${name} is not an object`);
  }

  if (Array.isArray(obj)) {
    throw new TypeError(`Microformats parser: ${name} is not an object`);
  }

  if (obj === null) {
    throw new TypeError(`Microformats parser: ${name} cannot be null`);
  }

  const unknownKeys = Object.keys(obj).filter(
    (key) => !allowedKeys.includes(key)
  );

  if (unknownKeys.length) {
    throw new TypeError(
      `Microformats parser: ${name} contains unknown properties: ${unknownKeys.join(
        ", "
      )}`
    );
  }

  return obj as Record<string, unknown>;
};

export const validator = (
  unknownHtml: unknown,
  unknownOptions: unknown
): void => {
  assertIsString(unknownHtml, "HTML");

  const options = assertIsObject(
    unknownOptions,
    ["baseUrl", "experimental"],
    "options"
  );

  const baseUrl = assertIsString(options.baseUrl, "baseUrl");

  // verify the url provided is valid
  new URL(baseUrl);

  if ("experimental" in options) {
    const experimental = assertIsObject(
      options.experimental,
      ["lang", "textContent", "metaformats"],
      "experimental"
    );

    if ("lang" in experimental) {
      assertIsBoolean(experimental.lang, "experimental.lang");
    }

    if ("textContent" in experimental) {
      assertIsBoolean(experimental.textContent, "experimental.textContent");
    }

    if ("metaformats" in experimental) {
      assertIsBoolean(experimental.metaformats, "experimental.metaformats");
    }
  }
};

export const validateParsedHtml = (doc: Document): void => {
  // <html> and <body> are always defined (based on tests)
  // Provide error handling in the event they are ever not defined
  const html = doc.childNodes.find(isTag("html"));

  if (!html) {
    throw new Error("Microformats parser: No <html> element found");
  }

  const body = html.childNodes.find(isTag("body"));

  if (!body) {
    throw new Error("Microformats parser: No <body> element found");
  }

  // if we have no body children, it's the result of invalid HTML
  if (!body.childNodes.filter(isElement).length) {
    throw new Error("Microformats parser: unable to parse HTML");
  }
};
