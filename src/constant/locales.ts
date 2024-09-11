export const locales = ["en", "vi"] as const;
export const defaultLocale = "vi";
export type SupportedLanguage = (typeof locales)[number];
