const {
  name,
  description,
  version,
  repository,
  license,
  keywords,
} = require("../../parser/package.json");

const repo = repository.replace("git+", "").replace(".git", "");

module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        name,
        description,
        version: `v${version}`,
        repo,
        releases: `${repo}/releases`,
        licenseUrl: `${repo}/blob/master/LICENSE`,
        npm: `https://npmjs.org/package/${name}`,
        license,
        keywords: keywords.join(", "),
      },
    },
  },
};
