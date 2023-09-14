import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";
import html, { makeHtmlAttributes } from "@rollup/plugin-html";
import { readFileSync } from "fs";
import css from "rollup-plugin-import-css";

import pkg from "./package.json" assert { type: "json" };
const { name, description, version, repository, license, keywords } = pkg;

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
  {
    input: "./demo/demo.js",
    output: {
      dir: "./public",
      format: "esm",
      entryFileNames: "assets/bundle-[hash].js",
    },
    plugins: [
      nodeResolve(),
      commonjs({
        ignoreGlobal: true,
      }),
      css(),
      html({
        title: `${name} demo`,
        template: ({ attributes, files, meta, publicPath, title }) => {
          const repo = repository.replace("git+", "").replace(".git", "");
          const scripts = (files.js || [])
            .map(({ fileName }) => {
              const attrs = makeHtmlAttributes(attributes.script);
              return `<script src="${publicPath}${fileName}"${attrs}></script>`;
            })
            .join("\n");

          const links = (files.css || [])
            .map(({ fileName }) => {
              const attrs = makeHtmlAttributes(attributes.link);
              return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
            })
            .join("\n");

          const metas = meta
            .map((input) => {
              const attrs = makeHtmlAttributes(input);
              return `<meta${attrs}>`;
            })
            .join("\n");

          const replacements = {
            scripts,
            links,
            title,
            name,
            description,
            metas,
            version: `v${version}`,
            repo,
            releases: `${repo}/releases`,
            licenseUrl: `${repo}/blob/main/LICENSE`,
            npm: `https://npmjs.org/package/${name}`,
            license,
            keywords: keywords.join(", "),
          };

          let template = readFileSync("./demo/index.tpl.html", "utf-8");
          Object.entries(replacements).forEach(([key, value]) => {
            template = template.replaceAll(`{{ ${key} }}`, value);
          });
          return template;
        },
      }),
    ],
  },
];
