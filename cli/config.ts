import * as fs from "node:fs";
import * as path from "node:path";

export const PROJECT_NAME = "soluid";
export const CONFIG_FILENAME = `${PROJECT_NAME}.config.json`;
export const DEFAULT_CSS_FILENAME = `${PROJECT_NAME}.css`;
export const GITHUB_REPO = "misebox/soluid";
export const RELEASE_URL = `https://github.com/${GITHUB_REPO}/releases/download`;

export interface SoluidConfig {
  /** Components version to install */
  componentsVersion: string;
  /** Directory to install components into, relative to project root */
  componentDir: string;
  /** CSS file path relative to project root (e.g. "src/styles/soluid.css") */
  cssPath: string;
  /** Components to install */
  components: string[];
}

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
  const releases = await res.json() as Array<{ tag_name: string }>;
  for (const r of releases) {
    if (r.tag_name.startsWith("components-v")) {
      return r.tag_name.replace("components-v", "");
    }
  }
  throw new Error("No components release found");
}
