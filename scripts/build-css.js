const { compile } = require("@tailwindcss/node");
const oxide = require("@tailwindcss/oxide");
const fs = require("fs");
const path = require("path");

function buildCss() {
  const root = process.cwd();
  const sourceCssPath = path.join(root, "src/app/globals.source.css");
  const targetCssPath = path.join(root, "src/app/globals.css");

  if (!fs.existsSync(sourceCssPath)) {
    console.error("Missing src/app/globals.source.css");
    process.exit(1);
  }

  const sourceCss = fs.readFileSync(sourceCssPath, "utf8");

  const scanner = new oxide.Scanner({
    sources: [{ base: root, pattern: "src/**/*.{ts,tsx}", negated: false }],
  });

  const candidates = scanner.scan();

  return compile(sourceCss, {
    base: root,
    onDependency: () => {},
  }).then((res) => {
    const outputCss = res.build(candidates);
    fs.writeFileSync(targetCssPath, outputCss, "utf8");
    console.log(`[Tailwind] Generated ${outputCss.length} bytes of CSS with ${candidates.length} candidates.`);
  });
}

if (process.argv.includes("--watch")) {
  buildCss().then(() => {
    console.log("[Tailwind] Watching src/ for changes...");
    fs.watch(path.join(process.cwd(), "src"), { recursive: true }, (event, filename) => {
      if (filename && (filename.endsWith(".tsx") || filename.endsWith(".ts") || filename.endsWith(".source.css"))) {
        buildCss().catch(console.error);
      }
    });
  });
} else {
  buildCss().catch((err) => {
    console.error("[Tailwind] Error compiling CSS:", err);
    process.exit(1);
  });
}

