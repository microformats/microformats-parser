import { parser } from "./parser";
import { validator } from "./validator";
import { ParsedDocument } from "./types";

export interface Options {
  baseUrl: string;
}

export const mf2 = (html: string, options: Options): ParsedDocument => {
  validator(html, options);
  return parser(html, options);
};
