import * as fs from "node:fs";
import * as path from "node:path";

export const PROJECT_NAME = "soluid";
export const CONFIG_FILENAME = `${PROJECT_NAME}.config.json`;
export const DEFAULT_CSS_FILENAME = `${PROJECT_NAME}.css`;
export const GITHUB_REPO = "misebox/soluid";
export const RELEASE_URL = `https://github.com/${GITHUB_REPO}/releases/download`;

/** Allowed override keys for the `colors` field. */
export type ColorOverrideKey = "primary" | "neutral" | "danger" | "success" | "warning" | "info";

export interface SoluidConfig {
  /** Components version to install */
  componentsVersion?: string;
  /** Directory to install components into, relative to project root */
  componentDir: string;
  /** CSS file path relative to project root (e.g. "src/soluid.css") */
  cssPath: string;
  /** Components to install */
  components: string[];
  /**
   * Optional color overrides. Each key sets the corresponding `--so-color-{key}-base`.
   * Derived shades (hover/active/subtle/border) are recomputed automatically via color-mix.
   * Light/dark themes are handled automatically; no separate dark values are needed.
   */
  colors?: Partial<Record<ColorOverrideKey, string>>;
}

export const COLOR_OVERRIDE_KEYS: readonly ColorOverrideKey[] = [
  "primary",
  "neutral",
  "danger",
  "success",
  "warning",
  "info",
];

export function findConfigPath(cwd: string): string {
  return path.join(cwd, CONFIG_FILENAME);
}

export function loadConfig(cwd: string): SoluidConfig | null {
  const configPath = findConfigPath(cwd);
  if (!fs.existsSync(configPath)) return null;
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw) as SoluidConfig;
}

export function saveConfig(cwd: string, config: SoluidConfig): void {
  const configPath = findConfigPath(cwd);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

export async function fetchLatestComponentsVersion(): Promise<string> {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=20`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch releases: ${res.status}`);
  }
  const releases = (await res.json()) as Array<{ tag_name: string; prerelease?: boolean; draft?: boolean }>;
  for (const r of releases) {
    if (!r.prerelease && !r.draft && r.tag_name.startsWith("components-v")) {
      return r.tag_name.replace("components-v", "");
    }
  }
  throw new Error("No components release found");
}

export function requireConfig(cwd: string): SoluidConfig {
  const config = loadConfig(cwd);
  if (config === null) {
    console.error(`${CONFIG_FILENAME} not found. Run: npx ${PROJECT_NAME} init`);
    process.exit(1);
  }
  const missing: string[] = [];
  if (typeof config.componentDir !== "string" || config.componentDir.length === 0) missing.push("componentDir");
  if (typeof config.cssPath !== "string" || config.cssPath.length === 0) missing.push("cssPath");
  if (!Array.isArray(config.components)) missing.push("components");
  if (missing.length > 0) {
    console.error(`${CONFIG_FILENAME} is missing required field(s): ${missing.join(", ")}`);
    console.error(`Re-run: npx ${PROJECT_NAME} init  (or add the field(s) manually)`);
    process.exit(1);
  }
  return config;
}

export async function fetchVersionOrExit(): Promise<string> {
  try {
    return await fetchLatestComponentsVersion();
  } catch (e) {
    console.error(`Failed to fetch version: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  }
}
