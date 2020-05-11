import { ParentNode } from "../types";
import { getAttributeValue, hasClassName } from "./attributes";
import { textContent } from "./textContent";
import { findChildren } from "./findChildren";
import { isValueClass } from "./nodeMatchers";

interface Options {
  datetime: boolean;
}

const datetimeProp = (node: ParentNode): string | undefined =>
  getAttributeValue(node, "datetime");

const valueTitle = (node: ParentNode): string | undefined => {
  if (hasClassName(node, "value-title")) {
    return getAttributeValue(node, "title");
  }

  return;
};

const handleDate = (dateString: string): string | undefined =>
  dateString
    .trim()
    .replace(
      // remove ":" from timezones
      /((\+|-)[0-2][0-9]):([0-5][0-9])$/,
      (s) => s.replace(":", "")
    )
    .replace(
      // handle am and pm times
      /([0-2]?[0-9])(:[0-5][0-9])?(:[0-5][0-9])?(a\.?m\.?|p\.?m\.?)/i,
      (_s, hour, min, sec, ampm) => {
        const isAm = /a/i.test(ampm);

        // if the time is:
        // - am, zero pad
        // - pm, add 12 hours
        const newHour = isAm
          ? hour.padStart(2, "0")
          : `${parseInt(hour, 10) + 12}`;

        // reconstruct, and add mins if any are missing
        return `${newHour}${min ? min : ":00"}${sec || ""}`;
      }
    )
    .toUpperCase();

export const valueClassPattern = (
  node: ParentNode,
  { datetime }: Partial<Options> = {}
): string | undefined => {
  const values = findChildren(node, isValueClass);

  if (!values.length) {
    return;
  }

  if (datetime) {
    const date = values
      .map(
        (node) => datetimeProp(node) ?? valueTitle(node) ?? textContent(node)
      )
      .join(" ");
    return handleDate(date);
  }

  return values
    .map((node) => valueTitle(node) ?? textContent(node))
    .join("")
    .trim();
};
