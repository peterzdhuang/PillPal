import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Language translations
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      language: "Language",
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
      language: "Langue",
    },
  },
  // Add other languages here
};

i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources,
    lng: "en", // Default language
    interpolation: {
      escapeValue: false, // React already escapes XSS
    },
  });

export default i18n;
