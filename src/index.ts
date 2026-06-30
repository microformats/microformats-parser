import { parser } from "./parser.js";
import { validator } from "./validator.js";
import { ParsedDocument } from "./types.js";

export interface Options {
  baseUrl: string;
  experimental?: {
    lang?: boolean;
    textContent?: boolean;
    metaformats?: boolean;
  };
}

export const mf2 = (html: string, options: Options): ParsedDocument => {
  validator(html, options);
  return parser(html, options);
};
