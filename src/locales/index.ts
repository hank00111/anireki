export type SupportedLocale = "zh-TW" | "en" | "ja";

export const DEFAULT_LOCALE: SupportedLocale = "zh-TW";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["zh-TW", "en", "ja"];

export const LOCALE_LABELS = {
	"zh-TW": "繁體中文",
	en: "English",
	ja: "日本語",
} as const;
