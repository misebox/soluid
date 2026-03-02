import * as path from "node:path";

/**
 * Rewrite internal soluid relative imports for the user's project.
 */
export function rewriteImports(
  content: string,
  filePath: string, // path of this file relative to componentDir (e.g. "Button.tsx", "core/types.ts")
): string {
  // Match import statements with relative paths (starting with . or ..)
  const importRegex =
    /((?:import|export)\s+(?:type\s+)?(?:\{[^}]*\}|[\w*]+(?:\s*,\s*\{[^}]*\})?)\s+from\s+["'])(\.[^"']+)(["'])/g;

  return content.replace(
    importRegex,
    (_match, prefix: string, importPath: string, suffix: string) => {
      const fileDir = path.dirname(filePath);
      const resolved = path.normalize(path.join(fileDir, importPath));

      let rel = path.relative(fileDir, resolved);
      if (!rel.startsWith(".")) {
        rel = "./" + rel;
      }

      return `${prefix}${rel}${suffix}`;
    },
  );
}
