import type { Lang } from "../lang";
import { en } from "./en";
import { ja } from "./ja";

const locales: Record<Lang, Record<string, string>> = { en, ja };

export function t(lang: Lang, key: string): string {
  return locales[lang][key] ?? "";
}
