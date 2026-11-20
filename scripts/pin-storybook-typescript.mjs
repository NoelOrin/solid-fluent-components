import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function resolveTypeScript5() {
  try {
    return dirname(require.resolve("typescript5/package.json"));
  } catch {
    throw new Error(
      "Cannot find typescript@5.9 for Storybook. Install the typescript5 dev dependency.",
    );
  }
}

function main() {
  const source = resolveTypeScript5();
  const targetRoot = join(root, "node_modules", "storybook-solidjs-vite", "node_modules");
  const target = join(targetRoot, "typescript");

  if (!existsSync(join(root, "node_modules", "storybook-solidjs-vite"))) {
    console.log("[postinstall] storybook-solidjs-vite not installed, skip TS5 pin");
    return;
  }

  mkdirSync(targetRoot, { recursive: true });
  rmSync(target, { recursive: true, force: true });
  cpSync(source, target, { recursive: true });
  console.log(`[postinstall] pinned typescript@5.9.3 for storybook-solidjs-vite`);
}

main();
