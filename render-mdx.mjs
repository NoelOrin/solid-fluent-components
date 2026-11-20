import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { compile } from "./node_modules/@storybook/addon-docs/dist/_node-chunks/chunk-BT2I4O4A.js";
import remarkGfm from "remark-gfm";

const require = createRequire(import.meta.url);
const reactRuntime = require.resolve("react/jsx-runtime");
const source = readFileSync("./src/docs/API.mdx", "utf8");
const compiledPath = "/tmp/solid-fluent-api.mjs";
const providerShimPath = "/tmp/solid-fluent-mdx-provider.mjs";
const blocksShimPath = "/tmp/solid-fluent-storybook-blocks.mjs";

writeFileSync(providerShimPath, "export const useMDXComponents = () => ({});\n");
writeFileSync(blocksShimPath, "export const Meta = () => null;\n");

const compiled = await compile(
  { path: "API.mdx", value: source },
  {
    mdxCompileOptions: {
      providerImportSource: providerShimPath,
      remarkPlugins: [remarkGfm],
    },
  },
);
writeFileSync(compiledPath, compiled);

await build({
  entryPoints: [compiledPath],
  bundle: true,
  format: "esm",
  write: true,
  outfile: "./api-mdx.bundled.mjs",
  platform: "node",
  absWorkingDir: process.cwd(),
  alias: {
    "react/jsx-runtime": reactRuntime,
    "@storybook/addon-docs/blocks": blocksShimPath,
  },
  logLevel: "silent",
});

const mod = await import("./api-mdx.bundled.mjs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const html = renderToStaticMarkup(React.createElement(mod.default));

console.log("RENDER_OK length=", html.length);
console.log(
  "h1:", html.includes("<h1"),
  "h2:", html.includes("<h2"),
  "table:", html.includes("<table"),
  "pre:", html.includes("<pre"),
  "code:", html.includes("<code"),
);
console.log("FIRST_300:", html.slice(0, 300));
