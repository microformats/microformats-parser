<h1>microformats-parser</h1>

A JavaScript microformats v2 parser, with v1 back-compatibility.

Follows the [microformats2 parsing specification](http://microformats.org/wiki/microformats2-parsing).

**Table of contents**

- [Quick start](#quick-start)
  - [Installation](#installation)
  - [Use](#use)
- [API](#api)
  - [mf2()](#mf2)
- [Contributing](#contributing)
- [Limitiations](#limitiations)
  - [Microformats v1 support](#microformats-v1-support)

## Quick start

### Installation

```bash
# yarn
yarn add microformats-parser

# npm
npm i microformats-parser
```

### Use

```javascript
import { mf2 } from "microformats-parser";

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

Use: `mf2(html: string, options: { baseUrl: string })`

- `html` (string, required) - the HTML string to be parsed
- `options` (object, required) - parsing options, with the following properties:
  - `baseUrl` (string, required) - a base URL to resolve relative URLs

Returns the parsed microformats from the HTML string

## Contributing

See our [contributing guidelines](./CONTRIBUTING.md) for more information.

## Limitiations

### Microformats v1 support

This package will parse microformats v1, however support will be limited to the v1 tests in the [microformats test suite](https://github.com/microformats/tests).
