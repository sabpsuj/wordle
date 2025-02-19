import { useTranslation } from "react-i18next";
import type { Languages } from "../types/Languages.type";
import "./LanguageSwitcher.scss";


export function LanguageSwitcher () {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: Languages) => {
    i18n.changeLanguage(language)
  }

  return (
    <div className="language-switcher" role="group" aria-label="Language Switcher">
      <button
        className={`language-switcher__button${i18n.language === "pl" ? " language-switcher__button--active" : ""}`}
        onClick={() => changeLanguage("pl")}
        aria-label="Switch to English"
        aria-pressed={i18n.language === "pl"}
      >
        <span>{t("language.polish")}</span>
      </button>
      <button
        className={`language-switcher__button${i18n.language === "en" ? " language-switcher__button--active" : ""}`}
        onClick={() => changeLanguage("en")}
        aria-label="Switch to Polish"
        aria-pressed={i18n.language === "en"}
      >
        <span>{t("language.english")}</span>
      </button>
    </div>
  )
}