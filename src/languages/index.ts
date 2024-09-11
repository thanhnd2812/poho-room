import "server-only";

const languages = {
  en: () => import("./en.json"),
  vi: () => import("./vi.json"),
};

export const getLanguage = async (lang: keyof typeof languages) => {
  const language = await languages[lang]();
  return language;
};
