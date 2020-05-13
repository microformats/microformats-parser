<h1>Contributing</h1>

- [Ways to contribute](#ways-to-contribute)
- [Developer environment](#developer-environment)
- [Node support](#node-support)
- [Developer tools](#developer-tools)
- [Microformats specifications](#microformats-specifications)
- [License](#license)

## Ways to contribute

Anyone can contribute to this project in one of many ways, for example:

- Create an issue for a bug
- Open a pull request to make an improvement
- Open a pull request to fix a bug
- Participate in discussion

## Developer environment

This project is developed using the latest LTS version of node and yarn. If you use `nvm`, you can run `nvm use` in the root of this project to switch to the correct version of node.

## Node support

We support all versions that are currently supported on the [node LTS schedule](https://nodejs.org/en/about/releases/).

## Developer tools

We use a few developer tools to help maintain code quality.

- TypeScript is used to statically typecheck all code.
- Prettier (`yarn prettier:list`) is used as an opinionated code-formatter. A fix command is executed on each commit automatically.
- ESLint (`yarn lint`) validates your code against specific rules. A check is executed on each commit automatically, and will prevent a commit if there are any errors found.
- Mocha (`yarn test`) tests the package against a set of tests (located in `/test`). These are ran automatically in CI for each push.
  - These tests are ran against the [microformats test suite](https://github.com/microformats/tests) and some additional test cases.
  - Mocha tests for the built package is ran against all supported LTS versions of node.
  - Tests require 100% code coverage to pass.
  - Tests are not required to pass to be able to commit.
  - More information on adding new tests is available in the [test suite README](./test/suites/README.md).

## Microformats specifications

This project follows the [microformats2 parsing specification](http://microformats.org/wiki/microformats2-parsing) and tests all code against the [microformats test suite](https://github.com/microformats/tests).

All pull requests making changes to the parsing behaviour should reference the relevant specification and provide additional tests to cover the change.

## License

By contributing to this project, you agree that any contributions are made under the [MIT license](https://choosealicense.com/licenses/mit/).
