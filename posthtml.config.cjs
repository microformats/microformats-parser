import {
  name,
  description,
  version,
  repository,
  license,
  keywords,
} from "./package.json";

const repo = repository.replace("git+", "").replace(".git", "");

export default {
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
