import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import html from "@web/rollup-plugin-html";
import serve from "rollup-plugin-serve";

export default [
  {
    input: "./src/index.ts",
    // \0 is rollup convention for generated in memory modules
    external: (id) =>
      !id.startsWith("\0") && !id.startsWith(".") && !id.startsWith("/"),
    plugins: [
      typescript({
        outputToFilesystem: true,
        tsconfig: "./tsconfig.json",
      }),
      sourceMaps(),
      nodeResolve(),
      commonjs({
        ignoreGlobal: true,
      }),
      terser({
        compress: {
          passes: 2,
        },
      }),
    ],
    output: [
      {
        exports: "named",
        format: "cjs",
        sourcemap: true,
        file: "dist/index.cjs.js",
      },
      {
        format: "esm",
        sourcemap: true,
        file: "dist/index.esm.js",
      },
    ],
  },
];
