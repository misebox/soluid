import type { ColorDefinition } from "./types";

interface ColorRoles {
  base: string;
  fg: string;
  subtle: string;
  "subtle-fg": string;
  border: string;
  hover: string;
  active: string;
}

interface ThemeResult {
  cssText: string;
  warnings: string[];
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function generateRoles(base: string): ColorRoles {
  const [h, s, l] = hexToHsl(base);
  const fg = l > 55 ? "#0f172a" : "#ffffff";

  return {
    base,
    fg,
    subtle: hslToHex(h, Math.min(s, 30), 95),
    "subtle-fg": hslToHex(h, s, Math.max(l - 35, 15)),
    border: hslToHex(h, s, Math.min(l + 25, 80)),
    hover: hslToHex(h, s, Math.max(l - 8, 10)),
    active: hslToHex(h, s, Math.max(l - 15, 10)),
  };
}

function checkContrast(
  name: string,
  roles: ColorRoles,
  warnings: string[],
): void {
  const baseFgRatio = contrastRatio(roles.base, roles.fg);
  if (baseFgRatio < 4.5) {
    warnings.push(
      `[soluid] Color "${name}": base/fg contrast ratio ${baseFgRatio.toFixed(2)} < 4.5:1`,
    );
  }

  const subtleRatio = contrastRatio(roles.subtle, roles["subtle-fg"]);
  if (subtleRatio < 4.5) {
    warnings.push(
      `[soluid] Color "${name}": subtle/subtle-fg contrast ratio ${subtleRatio.toFixed(2)} < 4.5:1`,
    );
  }
}

export function createTheme(colors: ColorDefinition[]): ThemeResult {
  const warnings: string[] = [];
  const lines: string[] = [];

  for (const { name, base } of colors) {
    const roles = generateRoles(base);
    checkContrast(name, roles, warnings);

    for (const [role, value] of Object.entries(roles)) {
      lines.push(`  --so-color-${name}-${role}: ${value};`);
    }
  }

  const cssText = lines.length > 0 ? `:root {\n${lines.join("\n")}\n}` : "";

  if (import.meta.env?.DEV) {
    for (const w of warnings) {
      console.warn(w);
    }
  }

  return { cssText, warnings };
}
