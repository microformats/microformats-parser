import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";

export default [
  {
    input: "./src/index.ts",
    external: (id) =>
      !id.startsWith("\0") && !id.startsWith(".") && !id.startsWith("/"),
    plugins: [
      typescript({
        outputToFilesystem: true,
        tsconfig: "./tsconfig.json",
      }),
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
  {
    input: "./dist/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
