# Test suites

We use the [microformats test suite](https://github.com/microformats/tests) to test this package. Occasionally it can miss some test cases, or not provide 100% coverage of the code. To fill in these gaps, we have extra test cases defined here.

## Test folders

We have 2 main test folders:

- `local` - additional tests to compliment the global test suite.
- `experimental` - tests designed to cover experimental features that are not yet part of the microformats specification.

## Adding a test

1. Create a HTML document in the appropriate containing folder with the input for the test.
2. Create a JSON document in the same folder with the expected test output

We can run multiple tests cases within a file, so if there's a file you can add your case to, please do.
