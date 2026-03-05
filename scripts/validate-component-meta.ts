/**
 * Validates that all components listed in CATEGORIES have
 * corresponding entries in DEMOS, DESCRIPTIONS, and CODE_EXAMPLES.
 *
 * Run: bunx tsx scripts/validate-component-meta.ts
 */

import { CATEGORIES, CODE_EXAMPLES, DEMOS, DESCRIPTIONS } from "../src/dev/pages/componentDemos";

const allNames = CATEGORIES.flatMap((c) => c.components);
let hasError = false;

for (const name of allNames) {
  const missing: string[] = [];
  if (!DEMOS[name]) missing.push("DEMOS");
  if (!DESCRIPTIONS[name]) missing.push("DESCRIPTIONS");
  if (!CODE_EXAMPLES[name]) missing.push("CODE_EXAMPLES");
  if (missing.length > 0) {
    console.error(`  ${name}: missing from ${missing.join(", ")}`);
    hasError = true;
  }
}

if (hasError) {
  console.error("\nValidation failed.");
  process.exit(1);
} else {
  console.log(`All ${allNames.length} components have DEMOS, DESCRIPTIONS, and CODE_EXAMPLES.`);
}
