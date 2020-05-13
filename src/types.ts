import { BackcompatRoot } from "./backcompat";

export interface ParserOptions {
  baseUrl: string;
}

export interface ParsingOptions extends ParserOptions {
  roots: BackcompatRoot[];
  implyProperties?: boolean;
  idRefs: IdRefs;
}

export interface ParsedDocument {
  rels: Rels;
  "rel-urls": RelUrls;
  items: MicroformatRoot[];
}

export interface Attribute {
  name: string;
  value: string;
}

export interface ParentNode {
  attrs: Attribute[];
  parentNode: ParentNode;
  childNodes: (ParentNode | TextNode)[];
  tagName: string;
}

export interface TextNode {
  value: string;
}

export type MixedNode = ParentNode | TextNode;

export type MicroformatProperties = Record<string, MicroformatProperty[]>;

export interface MicroformatRoot {
  id?: string;
  type?: string[];
  properties: MicroformatProperties;
  children?: MicroformatRoot[];
  value?: MicroformatProperty;
}

export interface Image {
  alt: string;
  value?: string;
}

export interface Html {
  html: string;
  value: string;
}

export type MicroformatProperty = MicroformatRoot | Image | Html | string;

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

export type IdRefs = Record<string, ParentNode>;

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
