import * as path from "node:path";
import type { SolidoutConfig } from "./config.js";

/**
 * Rewrite internal solidout imports in a template file.
 *
 * Template files use relative imports like:
 *   import { cls } from "../../core/utils"
 *   import { FormField } from "./FormField"
 *   import { createFocusTrap } from "../../primitives/createFocusTrap"
 *
 * These need to be rewritten to point to the correct location
 * in the user's project, using either an alias or relative paths.
 */
export function rewriteImports(
  content: string,
  filePath: string, // path of this file relative to componentDir (e.g. "components/form/TextField.tsx")
  config: SolidoutConfig,
): string {
  // Match import statements with relative paths (starting with . or ..)
  const importRegex =
    /((?:import|export)\s+(?:type\s+)?(?:\{[^}]*\}|[\w*]+(?:\s*,\s*\{[^}]*\})?)\s+from\s+["'])(\.[^"']+)(["'])/g;

  return content.replace(
    importRegex,
    (_match, prefix: string, importPath: string, suffix: string) => {
      // Resolve the import path relative to the file's location within the template tree
      const fileDir = path.dirname(filePath);
      const resolvedInTemplate = path.normalize(path.join(fileDir, importPath));

      // Now create the correct import path for the user's project
      const newImportPath = buildImportPath(
        resolvedInTemplate,
        fileDir,
        config,
      );

      return `${prefix}${newImportPath}${suffix}`;
    },
  );
}

function buildImportPath(
  targetPathInTemplate: string, // e.g. "core/utils" or "components/form/FormField"
  sourceDir: string, // e.g. "components/form"
  config: SolidoutConfig,
): string {
  if (config.alias) {
    // Use alias: @/components/ui/core/utils
    const aliasRoot = config.aliasBase
      ? `${config.alias}/${config.componentDir.replace(new RegExp(`^${config.aliasBase}/`), "")}`
      : `${config.alias}/${config.componentDir}`;
    return `${aliasRoot}/${targetPathInTemplate}`;
  }

  // Use relative path from source file to target
  let rel = path.relative(sourceDir, targetPathInTemplate);
  if (!rel.startsWith(".")) {
    rel = "./" + rel;
  }
  return rel;
}
