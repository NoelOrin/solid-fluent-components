import type { StorybookConfig } from "storybook-solidjs-vite";
import { mergeConfig } from "vite";
import solid from "vite-plugin-solid";
import { fileURLToPath, URL } from "node:url";
import remarkGfm from "remark-gfm";

const srcEntry = fileURLToPath(new URL("../src/index.ts", import.meta.url));

// GitHub Pages serves project sites under /<repo>/. Storybook's static output
// uses absolute asset paths by default, so set Vite's base only for Pages
// builds (GITHUB_PAGES=1) and keep local builds at the root.
const ghPages = process.env.GITHUB_PAGES === "1";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "solid-fluent-components";
const pagesBase = ghPages ? `/${repo}/` : undefined;

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    "@chromatic-com/storybook",
  ],
framework: {
    name: "storybook-solidjs-vite",
    options: {
      // TypeScript 7 API is incompatible with storybook-solidjs-vite docgen.
      // Keep autodocs stories, disable TS language-service prop extraction.
      docgen: false,
    },
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      ...(pagesBase ? { base: pagesBase } : {}),
      plugins: [solid()],
      resolve: {
        alias: {
          "@solid-fluent/components": srcEntry,
        },
      },
      define: {
        "process.env": {},
      },
    });
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
