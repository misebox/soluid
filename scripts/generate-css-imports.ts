import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.resolve(__dirname, "../src/components/ui/soluid");
const outPath = path.resolve(__dirname, "../src/dev/soluid-all.css");

const coreImport = '@import "../components/ui/soluid/core/soluid.css";';

const cssFiles = fs
  .readdirSync(componentsDir)
  .filter((f) => f.endsWith(".css"))
  .sort();

const imports = cssFiles.map(
  (f) => `@import "../components/ui/soluid/${f}";`,
);

const content = [coreImport, ...imports, ""].join("\n");

fs.writeFileSync(outPath, content);
console.log(`Generated ${cssFiles.length} CSS imports -> ${outPath}`);
