import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pl from "./pl.json";
import en from "./en.json";

const resources = {
  en: {
    translation: en,
  },
  pl: {
    translation: pl,
  },
  halloween: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
