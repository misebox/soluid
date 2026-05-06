/**
 * Validates that all components listed in CATEGORIES have
 * corresponding entries in DEMOS, CODE_EXAMPLES, and locale descriptions.
 *
 * Run: bun scripts/validate-component-meta.ts
 */

import { CATEGORIES, CODE_EXAMPLES, DEMOS } from "../src/dev/pages/componentDemos";
import { en } from "../src/dev/locales/en";

const allNames = CATEGORIES.flatMap((c) => c.components);
let hasError = false;

for (const name of allNames) {
  const missing: string[] = [];
  if (!DEMOS[name]) missing.push("DEMOS");
  if (!CODE_EXAMPLES[name]) missing.push("CODE_EXAMPLES");
  if (!en[`desc.${name}` as keyof typeof en]) missing.push("locale desc");
  if (missing.length > 0) {
    console.error(`  ${name}: missing from ${missing.join(", ")}`);
    hasError = true;
  }
}

if (hasError) {
  console.error("\nValidation failed.");
  process.exit(1);
} else {
  console.log(`All ${allNames.length} components have DEMOS, CODE_EXAMPLES, and locale descriptions.`);
}
