import { createSignal } from "solid-js";

export type Lang = "en" | "ja";
export const [lang, setLang] = createSignal<Lang>("en");
