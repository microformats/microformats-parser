import { DefaultTreeAdapterMap } from "parse5";

export type Element = DefaultTreeAdapterMap["element"];
export type Document = DefaultTreeAdapterMap["document"];
export type Attribute = Element["attrs"][number];
export type Node = DefaultTreeAdapterMap["node"];
export type TextNode = DefaultTreeAdapterMap["textNode"];

import { BackcompatRoot } from "./backcompat";

export interface ParserOptions {
  baseUrl: string;
  experimental?: {
    lang?: boolean;
    textContent?: boolean;
    metaformats?: boolean;
    authorship?: boolean;
  };
}

export type ExperimentalName = keyof NonNullable<ParserOptions["experimental"]>;

export interface ParsingOptions extends ParserOptions {
  implyProperties?: boolean;
  idRefs: IdRefs;
  inherited: {
    roots: BackcompatRoot[];
    lang?: string;
  };
  rels: Rels;
}

export interface ParsedDocument {
  rels: Rels;
  "rel-urls": RelUrls;
  items: MicroformatRoot[];
}

export type MicroformatProperties = Record<string, MicroformatProperty[]>;

export interface MicroformatRoot {
  id?: string;
  lang?: string;
  type?: string[];
  properties: MicroformatProperties;
  children?: MicroformatRoot[];
  value?: MicroformatProperty;
}

export interface Author {
  name?: string;
  value: string;
  photo?: string;
  url?: string;
}

export interface Image {
  alt: string;
  value?: string;
}

export interface Html {
  html: string;
  value: string;
  lang?: string;
}

export type MicroformatProperty =
  | MicroformatRoot
  | Author
  | Image
  | Html
  | string;

export type Rels = Record<string, string[]>;

export type RelUrls = Record<
  string,
  {
    rels: string[];
    text: string;
    title?: string;
    media?: string;
    hreflang?: string;
    type?: string;
  }
>;

export type IdRefs = Record<string, Element>;

export type PropertyType = "p" | "u" | "e" | "dt";

export interface ParsedProperty {
  key: string;
  value: MicroformatProperty | undefined;
  type: PropertyType;
}

export interface Backcompat {
  type: string[];
  properties: Record<string, string>;
  rels?: Record<string, string>;
}
