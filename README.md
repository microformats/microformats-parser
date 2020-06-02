<h1>microformats-parser</h1>

A JavaScript microformats v2 parser, with v1 back-compatibility. [View the demo](https://aimee-gm.github.io/microformats-parser/). Works with both the browser and node.js.

Follows the [microformats2 parsing specification](http://microformats.org/wiki/microformats2-parsing).

**Table of contents**

- [Quick start](#quick-start)
  - [Installation](#installation)
  - [Simple use](#simple-use)
- [API](#api)
  - [mf2()](#mf2)
- [Support](#support)
  - [Microformats v1](#microformats-v1)
  - [Microformats v2](#microformats-v2)
  - [Experimental options](#experimental-options)
    - [`lang`](#lang)
    - [`collapseWhitespace`](#collapsewhitespace)
- [Contributing](#contributing)

## Quick start

### Installation

```bash
# yarn
yarn add microformats-parser

# npm
npm i microformats-parser
```

### Simple use

```javascript
const { mf2 } = require("microformats-parser");

const parsed = mf2('<a class="h-card" href="/" rel="me">Jimmy</a>', {
  baseUrl: "http://example.com/",
});

console.log(parsed);
```

Outputs:

```json
{
  "items": [
    {
      "properties": {
        "name": ["Jimmy"],
        "url": ["http://example.com/"]
      },
      "type": ["h-card"]
    }
  ],
  "rel-urls": {
    "http://example.com": {
      "rels": ["me"],
      "text": "Jimmy"
    }
  },
  "rels": {
    "me": ["http://example.com/"]
  }
}
```

## API

### mf2()

Use: `mf2(html: string, options: { baseUrl: string, experimental: object })`

- `html` (string, required) - the HTML string to be parsed
- `options` (object, required) - parsing options, with the following properties:
  - `baseUrl` (string, required) - a base URL to resolve relative URLs
  - `experimental` (object, optional) - experimental (non-standard) options
    - `lang` (boolean, optional) - enable support for parsing `lang` attributes
    - `collapseWhitespace` (boolean, optional) - enable support for collapsing whitespace in properties and `value`s generated from text content.

Returns the parsed microformats from the HTML string

## Support

### Microformats v1

This package will parse microformats v1, however support will be limited to the v1 tests in the [microformats test suite](https://github.com/microformats/tests). Contributions are still welcome for improving v1 support.

### Microformats v2

We provide support for all mircroformats v2 parsing, as detailed in the [microformats2 parsing specification](http://microformats.org/wiki/microformats2-parsing). If there is an issue with v2 parsing, please create an issue.

### Experimental options

There is also support for some experimental parsing options. These can be enabled with the `experimental` flags in the `options` API.

**Note: Experimental options are subject to change at short notice and may change their behaviour without a major version update**

#### `lang`

Parse microformats for `lang` attributes. This will include `lang` on microformats and `e-*` properties where available.

These are sourced from the element themselves, a parent microformat, the HTML document or a meta tag.

#### `collapseWhitespace`

When parsing microformats for text content, all the consecutive whitespace is collapsed into a single space.

## Contributing

See our [contributing guidelines](./CONTRIBUTING.md) for more information.
