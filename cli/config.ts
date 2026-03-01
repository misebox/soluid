import * as fs from "node:fs";
import * as path from "node:path";

export const CONFIG_FILENAME = "solidout.config.json";

export interface SolidoutConfig {
  /** Directory to install components into, relative to project root */
  componentDir: string;
  /** Import alias (e.g. "@", "~") or empty string for relative paths */
  alias: string;
  /** Base path that the alias maps to (e.g. "src" if @ → src/) */
  aliasBase: string;
  /** CSS filename placed in core/ (default: "solidout.css") */
  cssFilename: string;
  /** Components to install */
  components: string[];
}

export const defaultConfig: SolidoutConfig = {
  componentDir: "src/components/ui",
  alias: "",
  aliasBase: "src",
  cssFilename: "solidout.css",
  components: [],
};

export function findConfigPath(cwd: string): string {
  return path.join(cwd, CONFIG_FILENAME);
}

export function loadConfig(cwd: string): SolidoutConfig | null {
  const configPath = findConfigPath(cwd);
  if (!fs.existsSync(configPath)) return null;
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw) as SolidoutConfig;
}

export function saveConfig(cwd: string, config: SolidoutConfig): void {
  const configPath = findConfigPath(cwd);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}
