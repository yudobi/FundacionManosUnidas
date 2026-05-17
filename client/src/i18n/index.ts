import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import esCommon from "./locales/es/common.json";
import esProjects from "./locales/es/projects.json";
import esTestimonials from "./locales/es/testimonials.json";
import enCommon from "./locales/en/common.json";
import enProjects from "./locales/en/projects.json";
import enTestimonials from "./locales/en/testimonials.json";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: esCommon,
        projects: esProjects,
        testimonials: esTestimonials,
      },
      en: {
        common: enCommon,
        projects: enProjects,
        testimonials: enTestimonials,
      },
    },
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    nonExplicitSupportedLngs: true,
    ns: ["common", "projects", "testimonials"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "fmu_lang",
    },
  });

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.resolvedLanguage ?? "es";
  i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
}

export default i18n;
