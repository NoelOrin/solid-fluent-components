import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), "fluent-audit-"));

function collectLocalExports(src) {
  const current = new Set();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".tsx") || name.endsWith(".ts")) {
        const text = readFileSync(full, "utf8");
        for (const line of text.split("\n")) {
          const m = line.match(
            /\s*export\s+(?:default\s+)?(?:async\s+)?(?:function|const|let|var|type|interface|class|enum)\s+([A-Za-z_$][\w$]*)/
          );
          if (m) current.add(m[1]);
          const re = /\bexport\s*\{([^}]+)\}/g;
          let ex;
          while ((ex = re.exec(line))) {
            for (const part of ex[1].split(",")) {
              const alias = part.trim().split(/\s+as\s+/);
              const n = alias[alias.length - 1].trim();
              if (n) current.add(n);
            }
          }
        }
      }
    }
  };
  walk(src);
  return current;
}

try {
  execFileSync("npm", ["pack", "@fluentui/react-components@9.74.5", "--pack-destination", tmp], { cwd: root, stdio: "pipe" });
  const tarball = readdirSync(tmp).find((f) => f.endsWith(".tgz"));
  execFileSync("tar", ["-xzf", join(tmp, tarball), "-C", tmp], { cwd: root, stdio: "pipe" });

  const dts = readFileSync(join(tmp, "package", "dist", "index.d.ts"), "utf8");
  const official = new Set();
  const importRe = /import\s*\{([^}]+)\}\s*from\s*["']@fluentui\//g;
  const exportRe = /export\s*\{([^}]+)\}\s*from\s*["']@fluentui\//g;
  const collect = (re) => {
    let m;
    while ((m = re.exec(dts))) {
      for (const part of m[1].split(",")) {
        const alias = part.trim().split(/\s+as\s+/);
        const n = alias[alias.length - 1].trim();
        if (n) official.add(n);
      }
    }
  };
  collect(importRe);
  collect(exportRe);

  const current = collectLocalExports(join(root, "src"));
  const missing = [...official].filter((n) => !current.has(n)).sort();
  const extra = [...current].filter((n) => !official.has(n)).sort();

  const exempt = new Set([
    "ForwardRefComponent", "GriffelStyle", "GriffelResetStyle",
    "Image_2", "Option_2", "Text_2",
    "ComponentProps", "ComponentState", "ShorthandProps", "ObjectShorthandProps", "Slots",
  ]);
  const realMissing = missing.filter((n) => !exempt.has(n));

  const report = [
    "# Fluent Parity Report",
    "",
    `- Official exports: ${official.size}`,
    `- Current exports: ${current.size}`,
    `- Missing (raw): ${missing.length}`,
    `- Missing (exempted): ${missing.length - realMissing.length}`,
    `- Missing (actionable): ${realMissing.length}`,
    `- Extra: ${extra.length}`,
    "",
    "## Missing (actionable)",
    "",
    realMissing.map((name) => `- ${name}`).join("\n") || "_(none)_",
    "",
    "## Extra (lib-specific)",
    "",
    extra.map((name) => `- ${name}`).join("\n") || "_(none)_",
    "",
  ].join("\n");

  writeFileSync(join(root, "docs", "superpowers", "plans", "fluent-parity-report.md"), report);
  console.log(`Report written. Official: ${official.size}, Current: ${current.size}, Missing(actionable): ${realMissing.length}, Extra: ${extra.length}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
