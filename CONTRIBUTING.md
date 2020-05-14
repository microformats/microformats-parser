<h1>Contributing</h1>

- [Ways to contribute](#ways-to-contribute)
- [Making Changes](#making-changes)
- [Microformats specifications](#microformats-specifications)
- [Node support](#node-support)
- [Developer environment](#developer-environment)
  - [Node/yarn version](#nodeyarn-version)
  - [Developer tools](#developer-tools)
- [License](#license)

## Ways to contribute

Anyone can contribute to this project in one of many ways, for example:

- Create an issue for a bug
- Open a pull request to make an improvement
- Open a pull request to fix a bug
- Participate in discussion

## Making Changes

1. Fork the repo into your own GitHub account and clone it to your local machine.
2. Use the versions of node and yarn from [development environment](#developer-environment).
3. Create a branch for the code changes you're looking to make with `git checkout -b branch-name`.
4. Add some tests to our test suites to describe the change you want to make. These are in the form of JSON/HTML pairs.
5. Write some code to pass the tests!
6. Commit your changes using `git commit -am 'A description of the change'`. We try to follow [conventional commit types](https://github.com/commitizen/conventional-commit-types), but this is not required.
7. Push the branch to your fork: `git push -u origin branch-name`.
8. Create a new pull request!

## Microformats specifications

This project follows the [microformats2 parsing specification](http://microformats.org/wiki/microformats2-parsing) and tests all code against the [microformats test suite](https://github.com/microformats/tests).

All pull requests making changes to the parsing behaviour should reference the relevant specification and provide additional tests to cover the change.

## Node support

We support all versions that are currently supported on the [node LTS schedule](https://nodejs.org/en/about/releases/).

## Developer environment

### Node/yarn version

This project is developed using:

- node@lts (active)
- yarn@1

If you use `nvm`, you can run `nvm use` in the root of this project to switch to the correct version of node.

### Developer tools

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

## License

By contributing to this project, you agree that any contributions are made under the [MIT license](https://choosealicense.com/licenses/mit/).
