import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { fileURLToPath, URL } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const srcEntry = fileURLToPath(new URL("./src/index.ts", import.meta.url));

export default defineConfig(({ mode }) => {
  const isLib = mode === "lib" || process.env.BUILD_LIB === "1";

  if (isLib) {
    return {
      plugins: [solid()],
      build: {
        lib: {
          entry: srcEntry,
          name: "SolidFluent",
          formats: ["es", "cjs"],
          fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
        },
        rollupOptions: {
          external: ["solid-js", "solid-js/web", "solid-js/store", "@floating-ui/dom"],
          output: {
            assetFileNames: "solid-fluent.[ext]",
            globals: {
              "solid-js": "Solid",
              "solid-js/web": "SolidWeb",
              "solid-js/store": "SolidStore",
              "@floating-ui/dom": "FloatingUIDOM",
            },
          },
        },
        cssCodeSplit: false,
        sourcemap: true,
        emptyOutDir: true,
      },
    };
  }

  return {
    plugins: [solid()],
    resolve: {
      alias: {
        "@solid-fluent/components": srcEntry,
      },
    },
    server: {
      port: 5173,
      open: false,
    },
    root: rootDir,
  };
});
