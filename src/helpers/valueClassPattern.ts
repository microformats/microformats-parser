import { getAttributeValue, hasClassName } from "./attributes";
import { textContent } from "./textContent";
import { findChildren } from "./findChildren";
import { isValueClass } from "./nodeMatchers";
import { ParsingOptions, Element } from "../types";

interface Options {
  datetime: boolean;
}

const datetimeProp = (node: Element): string | undefined =>
  getAttributeValue(node, "datetime");

const valueTitle = (node: Element): string | undefined => {
  if (hasClassName(node, "value-title")) {
    return getAttributeValue(node, "title");
  }

  return;
};

const handleDate = (dateStrings: string[]): string | undefined =>
  dateStrings
    .sort((a) =>
      // Sort the date elements to move date components to the start
      a.match(/^[0-9]{4}/) ? -1 : 1,
    )
    .join(" ")
    .trim()
    .replace(
      // remove ":" from timezones
      /((\+|-)[0-2][0-9]):([0-5][0-9])$/,
      (s) => s.replace(":", ""),
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
      },
    )
    .toUpperCase();

export const valueClassPattern = (
  node: Element,
  options: ParsingOptions & Partial<Options>,
): string | undefined => {
  const values = findChildren(node, isValueClass);

  if (!values.length) {
    return;
  }

  if (options.datetime) {
    const date = values.map(
      (node) =>
        datetimeProp(node) ?? valueTitle(node) ?? textContent(node, options),
    );
    return handleDate(date);
  }

  return values
    .map((node) => valueTitle(node) ?? textContent(node, options))
    .join("")
    .trim();
};
