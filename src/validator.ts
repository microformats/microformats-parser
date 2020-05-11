import { ParentNode } from "./types";
import { isParentNode } from "./helpers/nodeMatchers";

export const validator = (html: unknown, options: unknown): void => {
  if (typeof html === "undefined") {
    throw new TypeError("Microformats parser: HTML not provided");
  }

  if (typeof html !== "string") {
    throw new TypeError("Microformats parser: HTML is not a string");
  }

  if (html === "") {
    throw new TypeError("Microformats parser: HTML cannot be empty");
  }

  if (typeof options === "undefined") {
    throw new TypeError("Microformats parser: options is not provided");
  }

  if (typeof options !== "object") {
    throw new TypeError("Microformats parser: options is not an object");
  }

  if (options === null) {
    throw new TypeError("Microformats parser: options cannot be null");
  }

  // eslint-disable-next-line
  //@ts-ignore
  const { baseUrl } = options;

  if (typeof baseUrl === "undefined") {
    throw new TypeError("Microformats parser: baseUrl not provided");
  }

  if (typeof baseUrl !== "string") {
    throw new TypeError("Microformats parser: baseUrl is not a string");
  }

  if (baseUrl === "") {
    throw new TypeError("Microformats parser: baseUrl cannot be empty");
  }

  // verify the url provided is valid
  new URL(baseUrl);
};

export const validateParsedHtml = (doc: ParentNode): void => {
  // <html> and <body> are always defined (based on tests)
  // Provide error handling in the event they are ever not defined
  const html = doc.childNodes.find(
    (child): child is ParentNode =>
      isParentNode(child) && child.tagName === "html"
  );

  /* istanbul ignore if */
  if (!html) {
    throw new Error("Microformats parser: No <html> element found");
  }

  const body = html.childNodes.find(
    (child): child is ParentNode =>
      isParentNode(child) && child.tagName === "body"
  );

  /* istanbul ignore if */
  if (!body) {
    throw new Error("Microformats parser: No <body> element found");
  }

  // if we have no body children, it's the result of invalid HTML
  if (!body.childNodes.filter(isParentNode).length) {
    throw new Error("Microformats parser: unable to parse HTML");
  }
};
