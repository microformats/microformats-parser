import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/index.ts",
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
        file: "dist/index.cjs",
      },
      {
        format: "esm",
        sourcemap: true,
        file: "dist/index.mjs",
      },
    ],
  },
];
